import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { Account } from "../entities/account.entity";

type SecurityUser = Record<string, any>;
type SecurityProfile = Record<string, any>;

@Injectable()
export class AccountSecuritySyncService {
  private readonly logger = new Logger(AccountSecuritySyncService.name);
  private readonly securityBaseUrl =
    process.env.SECURITY_SERVICE_URL || "http://security-service-app-1:3015/api";
  private readonly requestTimeoutMs = parseInt(
    process.env.SECURITY_SYNC_REQUEST_TIMEOUT_MS || process.env.UPSTREAM_REQUEST_TIMEOUT_MS || "10000",
    10,
  );

  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  private getAccountDisplayName(account: Account): string {
    return String(account.getName || account.legalName || `Account ${account.id}`).trim();
  }

  async searchCandidates(
    q: string,
    limit = 10,
    authorizationHeader?: string,
  ): Promise<Record<string, any>> {
    const query = q.trim();
    if (!query) {
      throw new BadRequestException("q es requerido para buscar candidatos en Security.");
    }

    const userCandidates = new Map<string, any>();
    const profileCandidates = new Map<string, any>();
    const queries: Array<Record<string, any>> = [
      { email: query },
      { phone: query },
      { username: query },
      { identifierValue: query },
    ];

    const parts = query.split(/\s+/).filter(Boolean);
    if (parts.length === 2) {
      queries.push({ firstName: parts[0], lastName: parts[1] });
    }
    queries.push({ name: query }, { firstName: query }, { lastName: query });

    for (const where of queries) {
      const users = await this.searchUsersSafely(where, authorizationHeader);
      for (const user of users) {
        userCandidates.set(String(user.id), this.normalizeCandidate(user, null));
      }

      const profiles = await this.searchProfilesSafely(where, authorizationHeader);
      for (const profile of profiles) {
        const key = String(profile.id);
        const current = profileCandidates.get(key);
        profileCandidates.set(
          key,
          current ? { ...current, profileId: profile.id } : this.normalizeCandidate(null, profile),
        );
      }
    }

    const merged = new Map<string, any>();
    for (const candidate of userCandidates.values()) {
      const key = String(candidate.userId || candidate.profileId);
      merged.set(key, candidate);
    }
    for (const candidate of profileCandidates.values()) {
      const key = String(candidate.userId || candidate.profileId);
      const current = merged.get(key);
      merged.set(key, current ? { ...current, ...candidate } : candidate);
    }

    return {
      ok: true,
      message: "Candidatos de Security obtenidos con exito.",
      count: Array.from(merged.values()).slice(0, limit).length,
      data: Array.from(merged.values()).slice(0, limit),
    };
  }

  async pull(
    id: string,
    refs: Record<string, any>,
    authorizationHeader?: string,
  ): Promise<Record<string, any>> {
    const account = await this.repository.findOneBy({ id } as any);
    if (!account) {
      throw new NotFoundException("Account no encontrado.");
    }

    const explicitUserId = refs?.securityUserId || refs?.userId;
    const explicitProfileId = refs?.securityProfileId || refs?.profileId;
    let user = explicitUserId
      ? await this.getUserById(String(explicitUserId), authorizationHeader)
      : null;
    let profile = explicitProfileId
      ? await this.getProfileById(String(explicitProfileId), authorizationHeader)
      : null;

    if (!user && (account as any).securityUserId) {
      user = await this.getUserById(String((account as any).securityUserId), authorizationHeader);
    }
    if (!profile && (account as any).securityProfileId) {
      profile = await this.getProfileById(String((account as any).securityProfileId), authorizationHeader);
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

    const displayName =
      [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
      String(user?.name || user?.username || this.getAccountDisplayName(account) || "").trim();

    if (displayName) {
      account.setName = displayName;
    }
    if (user?.email) {
      account.email = String(user.email);
    }
    if (user?.phone) {
      account.phone = String(user.phone);
    }
    if (user?.id) {
      (account as any).securityUserId = String(user.id);
    }
    if (profile?.id) {
      (account as any).securityProfileId = String(profile.id);
    }
    (account as any).securitySyncStatus = "SYNCED";
    (account as any).securitySyncedAt = new Date();
    (account as any).securityLastAttemptAt = new Date();
    (account as any).securityHash = this.computeHash({
      accountId: account.id,
      user,
      profile,
    });

    const saved = await this.repository.save(account);
    return {
      ok: true,
      message: "Account sincronizada desde Security.",
      data: saved,
      security: { user, profile },
    };
  }

  async push(id: string, authorizationHeader?: string): Promise<Record<string, any>> {
    const account = await this.repository.findOneBy({ id } as any);
    if (!account) {
      throw new NotFoundException("Account no encontrado.");
    }

    let user: SecurityUser | null = null;
    let profile: SecurityProfile | null = null;
    const currentUserId = (account as any).securityUserId as string | undefined;
    const currentProfileId = (account as any).securityProfileId as string | undefined;

    try {
      if (currentUserId) {
        user = await this.updateUser(currentUserId, account, authorizationHeader);
      } else {
        user = await this.createUser(account, authorizationHeader);
      }

      if (!user?.id) {
        throw new BadRequestException("Security no devolvio userId al sincronizar account.");
      }

      if (currentProfileId) {
        profile = await this.updateProfile(currentProfileId, String(user.id), account, authorizationHeader);
      } else {
        const existingProfile = await this.getProfileByUserId(String(user.id), authorizationHeader);
        profile = existingProfile
          ? await this.updateProfile(String(existingProfile.id), String(user.id), account, authorizationHeader)
          : await this.createProfile(String(user.id), account, authorizationHeader);
      }

      (account as any).securityUserId = String(user.id);
      (account as any).securityProfileId = profile?.id ? String(profile.id) : undefined;
      (account as any).securitySyncStatus = "SYNCED";
      (account as any).securitySyncedAt = new Date();
      (account as any).securityLastAttemptAt = new Date();
      (account as any).securityHash = this.computeHash({
        accountId: account.id,
        user,
        profile,
      });
      const saved = await this.repository.save(account);
      return {
        ok: true,
        message: "Account sincronizada hacia Security.",
        data: saved,
        security: { user, profile },
      };
    } catch (error) {
      (account as any).securitySyncStatus = "ERROR";
      (account as any).securityLastAttemptAt = new Date();
      (account as any).securityLastErrorAt = new Date();
      await this.repository.save(account);
      throw error;
    }
  }

  private normalizeCandidate(user: any, profile: any): Record<string, any> {
    const firstName = profile?.firstName || "";
    const lastName = profile?.lastName || "";
    const displayName =
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      user?.name ||
      user?.username ||
      user?.email ||
      "Security candidate";
    return {
      userId: user?.id ? String(user.id) : profile?.userId ? String(profile.userId) : undefined,
      profileId: profile?.id ? String(profile.id) : undefined,
      displayName,
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      source: "security",
    };
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
    account: Account,
    authorizationHeader?: string,
  ): Promise<SecurityUser> {
    const payload = {
      username: this.buildUsername(this.getAccountDisplayName(account) || account.email || `account-${account.id}`),
      email: this.buildEmail(account.email, "account", account.id),
      phone: this.buildPhone(account.phone, "account", account.id),
      password: `CrmSync!${String(account.id).replace(/-/g, "").slice(0, 8)}`,
      termsAccepted: false,
      name: this.getAccountDisplayName(account),
      description: `Sincronizado desde CRM/account ${account.id}`,
      identifierType: "EMAIL",
      isActive: account.isActive,
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "account",
        sourceId: account.id,
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
    account: Account,
    authorizationHeader?: string,
  ): Promise<SecurityUser> {
    const payload = {
      id: userId,
      username: this.buildUsername(this.getAccountDisplayName(account) || account.email || `account-${account.id}`),
      email: this.buildEmail(account.email, "account", account.id),
      phone: this.buildPhone(account.phone, "account", account.id),
      name: this.getAccountDisplayName(account),
      description: `Sincronizado desde CRM/account ${account.id}`,
      isActive: account.isActive,
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "account",
        sourceId: account.id,
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
    account: Account,
    authorizationHeader?: string,
  ): Promise<SecurityProfile> {
    const payload = {
      name: this.getAccountDisplayName(account),
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
      isActive: account.isActive,
      userId,
      firstName: this.getAccountDisplayName(account),
      lastName: "",
      country: this.pickAddressValue(account.billingAddress, "country"),
      city: this.pickAddressValue(account.billingAddress, "city"),
      address: this.pickAddressValue(account.billingAddress, "address"),
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "account",
        sourceId: account.id,
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
    account: Account,
    authorizationHeader?: string,
  ): Promise<SecurityProfile> {
    const payload = {
      id: profileId,
      name: this.getAccountDisplayName(account),
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
      isActive: account.isActive,
      userId,
      firstName: this.getAccountDisplayName(account),
      lastName: "",
      country: this.pickAddressValue(account.billingAddress, "country"),
      city: this.pickAddressValue(account.billingAddress, "city"),
      address: this.pickAddressValue(account.billingAddress, "address"),
      metadata: {
        sourceBoundedContext: "crm",
        sourceAggregate: "account",
        sourceId: account.id,
      },
    };
    const response = await this.requestSecurity<any>(
      `/userprofiles/command/${profileId}`,
      { method: "PUT", body: JSON.stringify(payload) },
      authorizationHeader,
    );
    return this.extractResponseData(response);
  }

  private buildEmail(currentValue: string | undefined, prefix: string, id: string): string {
    const trimmed = String(currentValue || "").trim();
    return trimmed || `${prefix}.${String(id).slice(0, 12)}@crm-sync.local`;
  }

  private buildPhone(currentValue: string | undefined, prefix: string, id: string): string {
    const trimmed = String(currentValue || "").trim();
    return trimmed || `${prefix}-${String(id).slice(0, 12)}`;
  }

  private buildUsername(value: string): string {
    const normalized = String(value || "crm-sync")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return normalized || `crm-sync-${Date.now()}`;
  }

  private pickAddressValue(value: Record<string, any> | undefined, key: string): string {
    if (!value || typeof value !== "object") return "";
    const candidate = value[key];
    return candidate === undefined || candidate === null ? "" : String(candidate);
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