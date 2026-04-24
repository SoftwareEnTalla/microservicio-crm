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
 * Reconciler job del patrón upstream-mirror.
 * Intervalo configurable vía .env UPSTREAM_RECONCILE_INTERVAL_MINUTES (default 60 minutos).
 *
 * Dos flujos:
 *   1. downstream → upstream: registros LOCAL_ONLY con FK soft NULL son empujados
 *      como comando 'register-person-from-provider' al upstream.
 *   2. upstream → downstream: registros SYNCED con hash antiguo se refrescan.
 */
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { ProviderUpstreamClientService } from './provider-upstream-client.service';

@Injectable()
export class ProviderUpstreamReconcilerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    ProviderUpstreamReconcilerService.name,
  );
  private timer?: NodeJS.Timeout;

  constructor(
    @InjectRepository(Provider)
    private readonly repository: Repository<Provider>,
    private readonly upstreamClient: ProviderUpstreamClientService,
  ) {}

  private get intervalMs(): number {
    const raw = parseInt(
      process.env.UPSTREAM_RECONCILE_INTERVAL_MINUTES || '60',
      10,
    );
    const minutes = Number.isFinite(raw) && raw > 0 ? raw : 60;
    return minutes * 60 * 1000;
  }

  onModuleInit(): void {
    if (process.env.UPSTREAM_RECONCILE_ENABLED === 'false') {
      this.logger.log('Upstream reconciler deshabilitado (UPSTREAM_RECONCILE_ENABLED=false)');
      return;
    }
    this.logger.log(
      `Upstream reconciler iniciado: interval=${this.intervalMs / 60_000} min`,
    );
    this.timer = setInterval(() => {
      this.run().catch((err) =>
        this.logger.error('Fallo en reconciler tick', err),
      );
    }, this.intervalMs);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async run(): Promise<void> {
    const healthy = await this.upstreamClient.isUpstreamHealthy();
    if (!healthy) {
      this.logger.debug(
        'Upstream hrms:person no está healthy; skipping reconcile tick',
      );
      return;
    }

    // Flujo 1: empujar LOCAL_ONLY sin FK hacia upstream
    const pending = await this.repository.find({
      where: [
        { upstreamSyncStatus: 'LOCAL_ONLY' as any, personId: IsNull() } as any,
        { upstreamSyncStatus: 'PENDING_UPSTREAM' as any } as any,
      ],
      take: 50,
    });
    for (const record of pending) {
      try {
        (record as any).upstreamSyncStatus = 'PENDING_UPSTREAM';
        (record as any).upstreamLastAttemptAt = new Date();
        await this.repository.save(record);
        // NOTA: la publicación Kafka del comando register-person-from-provider
        // se gestiona desde el command handler estándar; aquí sólo marcamos PENDING.
      } catch (err) {
        (record as any).upstreamLastErrorAt = new Date();
        await this.repository.save(record);
        this.logger.warn(
          `Fallo empujando provider ${(record as any).id} al upstream`,
        );
      }
    }

    // Flujo 2: refrescar SYNCED cuya antigüedad supere el intervalo
    // (implementación completa depende del endpoint upstream concreto; se deja placeholder)
  }
}
