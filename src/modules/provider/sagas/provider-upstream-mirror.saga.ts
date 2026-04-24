/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


/**
 * Saga de upstream-mirror: consume eventos de hrms:person
 * (topic prefix: hrms.person) y propaga cambios al registro local
 * de Provider vinculado por FK soft personId.
 *
 * Estrategia de conflicto: upstream-wins.
 */
import { Injectable, Logger } from '@nestjs/common';
import { Saga } from '@nestjs/cqrs';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, catchError, tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Provider } from '../entities/provider.entity';

export interface UpstreamMirrorEventPayload {
  aggregateId: string;
  payload?: {
    instance?: Record<string, any>;
  };
  eventName?: string;
}

const MIRROR_FIELDS: Array<{ local: string; upstream: string }> = [{ local: 'firstName', upstream: 'firstName' }, { local: 'lastName', upstream: 'lastName' }, { local: 'documentType', upstream: 'documentType' }, { local: 'documentNumber', upstream: 'documentNumber' }, { local: 'email', upstream: 'email' }, { local: 'phone', upstream: 'phone' }];

@Injectable()
export class ProviderUpstreamMirrorSaga {
  private readonly logger = new Logger(ProviderUpstreamMirrorSaga.name);

  constructor(
    @InjectRepository(Provider)
    private readonly repository: Repository<Provider>,
  ) {}

  @Saga()
  onUpstreamEvent = ($events: Observable<any>): Observable<any> => {
    return $events.pipe(
      filter(
        (evt) =>
          typeof evt?.constructor?.name === 'string' &&
          evt.constructor.name.startsWith('Provider') === false &&
          (evt?.eventName?.toString?.().startsWith?.('hrms.person') ||
            evt?.topic?.toString?.().startsWith?.('hrms.person')),
      ),
      tap((evt) =>
        this.logger.debug(
          `Upstream event capturado: ${evt?.eventName ?? evt?.constructor?.name}`,
        ),
      ),
      mergeMap((evt) => this.applyMirror(evt)),
      catchError((err) => {
        this.logger.error('Error aplicando upstream-mirror', err);
        return of(null);
      }),
      map(() => null),
    );
  };

  private async applyMirror(evt: UpstreamMirrorEventPayload): Promise<void> {
    const upstreamInstance = evt?.payload?.instance;
    if (!upstreamInstance || !evt.aggregateId) return;

    const local = await this.repository.findOne({
      where: { personId: evt.aggregateId } as any,
    });
    if (!local) {
      this.logger.debug(
        `No hay downstream enlazado a upstream aggregate ${evt.aggregateId}; ignorando mirror`,
      );
      return;
    }

    const patch: Record<string, any> = {};
    for (const pair of MIRROR_FIELDS) {
      const v = upstreamInstance[pair.upstream];
      if (v !== undefined) patch[pair.local] = v;
    }
    if (Object.keys(patch).length === 0) return;

    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(patch))
      .digest('hex');

    Object.assign(local, patch, {
      upstreamSyncStatus: 'SYNCED',
      upstreamSyncedAt: new Date(),
      upstreamHash: hash,
      upstreamLastAttemptAt: new Date(),
    });
    await this.repository.save(local);
    this.logger.log(
      `Mirror aplicado a provider (aggregateId=${(local as any).id}) desde upstream ${evt.aggregateId}`,
    );
  }
}
