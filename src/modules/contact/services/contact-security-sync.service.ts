import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { Contact } from "../entities/contact.entity";

type SecurityUser = Record<string, any>;
type SecurityProfile = Record<string, any>;

@Injectable()
export class ContactSecuritySyncService {
  private readonly logger = new Logger(ContactSecuritySyncService.name);
  private readonly securityBaseUrl =
    process.env.SECURITY_SERVICE_URL || "http://security-service-app-1:3015/api";
  private readonly requestTimeoutMs = parseInt(
    process.env.SECURITY_SYNC_REQUEST_TIMEOUT_MS || process.env.UPSTREAM_REQUEST_TIMEOUT_MS || "10000",
    10,
  );

  constructor(
    @InjectRepository(Contact)
    private readonly repository: Repository<Contact>,
  ) {}

  async searchCandidates(
    q: string,
    limit = 10,
    authorizationHeader?: string,
  ): Promise<Record<string, any>> {
    const query = q.trim();
    if (!query) {
      throw new BadRequestException("q es requerido para buscar candidatos en Security.");
    }

    const candidates = new Map<string, any>();
    const queries: Array<Record<string, any>> = [
      { email: query },
      { phone: query },
      { username: query },
      { identifierValue: query },
      { name: query },
      { firstName: query },
      { lastName: query },
    ];
    const parts = query.split(/\s+/).filter(Boolean);
    if (parts.length === 2) {
      queries.push({ firstName: parts[0], lastName: parts[1] });
    }

    for (const where of queries) {
      const users = await this.searchUsersSafely(where, authorizationHeader);
      for (const user of users) {
        const key = String(user.id);
        candidates.set(key, {
          ...(candidates.get(key) || {}),
          userId: String(user.id),
          username: user.username,
          email: user.email,
          phone: user.phone,
        });
      }

      const profiles = await this.searchProfilesSafely(where, authorizationHeader);
      for (const profile of profiles) {
        const key = String(profile.userId || profile.id);
        candidates.set(key, {
          ...(candidates.get(key) || {}),
          userId: profile.userId ? String(profile.userId) : undefined,
          profileId: String(profile.id),
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName:
            [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
            profile.name,
        });
      }
    }

    return {
      ok: true,
      message: "Candidatos de Security obtenidos con exito.",
      count: Array.from(candidates.values()).slice(0, limit).length,
      data: Array.from(candidates.values()).slice(0, limit),
    };
  }

  async pull(
    id: string,
    refs: Record<string, any>,
    authorizationHeader?: string,
  ): Promise<Record<string, any>> {
    const contact = await this.repository.findOneBy({ id } as any);
    if (!contact) {
      throw new NotFoundException("Contact no encontrado.");
    }

    const explicitUserId = refs?.securityUserId || refs?.userId;
    const explicitProfileId = refs?.securityProfileId || refs?.profileId;
    let user = explicitUserId
      ? await this.getUserById(String(explicitUserId), authorizationHeader)
      : null;
    let profile = explicitProfileId
      ? await this.getProfileById(String(explicitProfileId), authorizationHeader)
      : null;

    if (!user && (contact as any).securityUserId) {
      user = await this.getUserById(String((contact as any).securityUserId), authorizationHeader);
    }
    if (!profile && (contact as any).securityProfileId) {
      profile = await this.getProfileById(String((contact as any).securityProfileId), authorizationHeader);
    }
    if (!profile && user?.id) {
      profile = await this.getProfileByUserId(String(user.id), authorizationHeader);
    }
    if (!user && profile?.userId) {
      user = await this.getUserById(String(profile.userId), authorizationHeader);
    }

    if (!user && !profile) {
      throw new NotFoundException("No se encontraron referencias vinculables en Security.");
    }

    if (profile?.firstName) {
      contact.firstName = String(profile.firstName);
    }
    if (profile?.lastName) {
      contact.lastName = String(profile.lastName);
    }
    const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim();
    if (fullName) {
      contact.fullName = fullName;
    }
    if (user?.email) {
      contact.email = String(user.email);
    }
    if (user?.phone) {
      contact.phone = String(user.phone);
      if (!String(contact.mobile || "").trim()) {
        contact.mobile = String(user.phone);
      }
    }
    if (user?.id) {
      (contact as any).securityUserId = String(user.id);
    }
    if (profile?.id) {
      (contact as any).securityProfileId = String(profile.id);
    }
    (contact as any).securitySyncStatus = "SYNCED";
    (contact as any).securitySyncedAt = new Date();
    (contact as any).securityLastAttemptAt = new Date();
    (contact as any).securityHash = this.computeHash({
      contactId: contact.id,
      user,
      profile,
    });

    const saved = await this.repository.save(contact);
    return {
      ok: true,
      message: "Contact sincronizado desde Security.",
      data: saved,
      security: { user, profile },
    };
  }

  async push(id: string, authorizationHeader?: string): Promise<Record<string, any>> {
    const contact = await this.repository.findOneBy({ id } as any);
    if (!contact) {
      throw new NotFoundException("Contact no encontrado.");
    }

    let user: SecurityUser | null = null;
    let profile: SecurityProfile | null = null;
    const currentUserId = (contact as any).securityUserId as string | undefined;
    const currentProfileId = (contact as any).securityProfileId as string | undefined;

    try {
      if (currentUserId) {
        user = await this.updateUser(currentUserId, contact, authorizationHeader);
      } else {
        user = await this.createUser(contact, authorizationHeader);
      }

      if (!user?.id) {
        throw new BadRequestException("Security no devolvio userId al sincronizar contact.");
      }

      if (currentProfileId) {
        profile = await this.updateProfile(currentProfileId, String(user.id), contact, authorizationHeader);
      } else {
        const existingProfile = await this.getProfileByUserId(String(user.id), authorizationHeader);
        profile = existingProfile
          ? await this.updateProfile(String(existingProfile.id), String(user.id), contact, authorizationHeader)
          : await this.createProfile(String(user.id), contact, authorizationHeader);
      }

      (contact as any).securityUserId = String(user.id);
      (contact as any).securityProfileId = profile?.id ? String(profile.id) : undefined;
      (contact as any).securitySyncStatus = "SYNCED";
      (contact as any).securitySyncedAt = new Date();
      (contact as any).securityLastAttemptAt = new Date();
      (contact as any).securityHash = this.computeHash({
        contactId: contact.id,
        user,
        profile,
      });
      const saved = await this.repository.save(contact);
      return {
        ok: true,
        message: "Contact sincronizado hacia Security.",
        data: saved,
        security: { user, profile },
      };
    } catch (error) {
      (contact as any).securitySyncStatus = "ERROR";
      (contact as any).securityLastAttemptAt = new Date();
      (contact as any).securityLastErrorAt = new Date();
      await this.repository.save(contact);
      throw error;
    }
  }

  private async searchUsers(
    where: Record<string, any>,
    authorizationHeader?: string,
  ): Promise<SecurityUser[]> {
    const payload = await this.requestSecurity<any>(
      `/users/query/search?where=${encodeURIComponent(JSON.stringify(where))}`,
      { method: "GET" },
      authorizationHeader,
    );
    const data = this.extractResponseData(payload);
    return Array.isArray(data) ? data : [];
  }

  private async searchUsersSafely(
    where: Record<string, any>,
    authorizationHeader?: string,
  ): Promise<SecurityUser[]> {
    try {
      return await this.searchUsers(where, authorizationHeader);
    } catch {
      this.logger.warn(`Security users search skipped for ${JSON.stringify(where)}`);
      return [];
    }
  }

  private async searchProfiles(
    where: Record<string, any>,
    authorizationHeader?: string,
  ): Promise<SecurityProfile[]> {
    const payload = await this.requestSecurity<any>(
      `/userprofiles/query/search?where=${encodeURIComponent(JSON.stringify(where))}`,
      { method: "GET" },
      authorizationHeader,
    );
    const data = this.extractResponseData(payload);
    return Array.isArray(data) ? data : [];
  }

  private async searchProfilesSafely(
    where: Record<string, any>,
    authorizationHeader?: string,
  ): Promise<SecurityProfile[]> {
    try {
      return await this.searchProfiles(where, authorizationHeader);
    } catch {
      this.logger.warn(`Security profiles search skipped for ${JSON.stringify(where)}`);
      return [];
    }
  }

  private async getUserById(
    userId: string,
    authorizationHeader?: string,
  ): Promise<SecurityUser | null> {
    const payload = await this.requestSecurity<any>(
      `/users/query/${encodeURIComponent(userId)}`,
      { method: "GET" },
      authorizationHeader,
      true,
    );
    if (!payload) return null;
    return this.extractResponseData(payload) || null;
  }

  private async getProfileById(
    profileId: string,
    authorizationHeader?: string,
  ): Promise<SecurityProfile | null> {
    const payload = await this.requestSecurity<any>(
      `/userprofiles/query/find-one?where=${encodeURIComponent(JSON.stringify({ id: profileId }))}`,
      { method: "GET" },
      authorizationHeader,
      true,
    );
    if (!payload) return null;
    return this.extractResponseData(payload) || null;
  }

  private async getProfileByUserId(
    userId: string,
    authorizationHeader?: string,
  ): Promise<SecurityProfile | null> {
    const payload = await this.requestSecurity<any>(
      `/userprofiles/query/find-one?where=${encodeURIComponent(JSON.stringify({ userId }))}`,
      { method: "GET" },
      authorizationHeader,
      true,
    );
    if (!payload) return null;
    return this.extractResponseData(payload) || null;
  }

  private async createUser(
    contact: Contact,
    authorizationHeader?: string,
  ): Promise<SecurityUser> {
    const payload = {
      username: this.buildUsername(contact.fullName || `${contact.firstName}-${contact.lastName}` || contact.email || `contact-${contact.id}`),
      email: this.buildEmail(contact.email, contact.id),
      phone: this.buildPhone(contact.phone || contact.mobile, contact.id),
      password: `CrmSync!${String(contact.id).replace(/-/g, "").slice(0, 8)}`,
      termsAccepted: Boolean(contact.consentEmail || contact.consentPhone),
      name: String(contact.fullName || `${contact.firstName} ${contact.lastName}` || `Contact ${contact.id}`).trim(),
      description: `Sincronizado desde CRM/contact ${contact.id}`,
      identifierType: "EMAIL",
      isActive: contact.isActive,
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "contact",
        sourceId: contact.id,
      },
    };
    const response = await this.requestSecurity<any>(
      "/users/command",
      { method: "POST", body: JSON.stringify(payload) },
      authorizationHeader,
    );
    return this.extractResponseData(response);
  }

  private async updateUser(
    userId: string,
    contact: Contact,
    authorizationHeader?: string,
  ): Promise<SecurityUser> {
    const payload = {
      id: userId,
      username: this.buildUsername(contact.fullName || `${contact.firstName}-${contact.lastName}` || contact.email || `contact-${contact.id}`),
      email: this.buildEmail(contact.email, contact.id),
      phone: this.buildPhone(contact.phone || contact.mobile, contact.id),
      name: String(contact.fullName || `${contact.firstName} ${contact.lastName}` || `Contact ${contact.id}`).trim(),
      description: `Sincronizado desde CRM/contact ${contact.id}`,
      isActive: contact.isActive,
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "contact",
        sourceId: contact.id,
      },
    };
    const response = await this.requestSecurity<any>(
      `/users/command/${userId}`,
      { method: "PUT", body: JSON.stringify(payload) },
      authorizationHeader,
    );
    return this.extractResponseData(response);
  }

  private async createProfile(
    userId: string,
    contact: Contact,
    authorizationHeader?: string,
  ): Promise<SecurityProfile> {
    const payload = {
      name: String(contact.fullName || `${contact.firstName} ${contact.lastName}` || `Contact ${contact.id}`).trim(),
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
      isActive: contact.isActive,
      userId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      country: "",
      city: "",
      address: "",
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "contact",
        sourceId: contact.id,
        roleType: contact.roleType,
        department: contact.department,
        jobTitle: contact.jobTitle,
      },
    };
    const response = await this.requestSecurity<any>(
      "/userprofiles/command",
      { method: "POST", body: JSON.stringify(payload) },
      authorizationHeader,
    );
    return this.extractResponseData(response);
  }

  private async updateProfile(
    profileId: string,
    userId: string,
    contact: Contact,
    authorizationHeader?: string,
  ): Promise<SecurityProfile> {
    const payload = {
      id: profileId,
      name: String(contact.fullName || `${contact.firstName} ${contact.lastName}` || `Contact ${contact.id}`).trim(),
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
      isActive: contact.isActive,
      userId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      country: "",
      city: "",
      address: "",
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "contact",
        sourceId: contact.id,
        roleType: contact.roleType,
        department: contact.department,
        jobTitle: contact.jobTitle,
      },
    };
    const response = await this.requestSecurity<any>(
      `/userprofiles/command/${profileId}`,
      { method: "PUT", body: JSON.stringify(payload) },
      authorizationHeader,
    );
    return this.extractResponseData(response);
  }

  private buildEmail(currentValue: string | undefined, id: string): string {
    const trimmed = String(currentValue || "").trim();
    return trimmed || `contact.${String(id).slice(0, 12)}@crm-sync.local`;
  }

  private buildPhone(currentValue: string | undefined, id: string): string {
    const trimmed = String(currentValue || "").trim();
    return trimmed || `contact-${String(id).slice(0, 12)}`;
  }

  private buildUsername(value: string): string {
    const normalized = String(value || "crm-sync")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return normalized || `crm-sync-${Date.now()}`;
  }

  private computeHash(payload: Record<string, any>): string {
    return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  }

  private extractResponseData(payload: any): any {
    if (!payload) return null;
    if (payload.data !== undefined) {
      return payload.data;
    }
    return payload;
  }

  private async requestSecurity<T>(
    relativePath: string,
    init: RequestInit,
    authorizationHeader?: string,
    allowNotFound = false,
  ): Promise<T | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    };
    if (authorizationHeader) {
      headers.Authorization = authorizationHeader;
    }

    try {
      const response = await fetch(`${this.securityBaseUrl}${relativePath}`, {
        ...init,
        headers: {
          ...headers,
          ...(init.headers as Record<string, string> | undefined),
        },
        signal: controller.signal,
      });
      const text = await response.text();
      const payload = text ? JSON.parse(text) : null;
      if (!response.ok) {
        if (allowNotFound && response.status === 404) {
          return null;
        }
        this.logger.warn(`Security request failed ${response.status} ${relativePath}`);
        throw new BadRequestException(payload?.message || `Security request failed with status ${response.status}`);
      }
      return payload as T;
    } finally {
      clearTimeout(timeout);
    }
  }
}