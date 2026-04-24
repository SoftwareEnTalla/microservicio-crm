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
 * Cliente HTTP hacia upstream hrms:person con circuit breaker
 * y timeout configurable. Permite que Provider opere en modo LOCAL_ONLY
 * cuando el upstream está DOWN (graceful degradation).
 */
import { Injectable, Logger } from '@nestjs/common';

type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

@Injectable()
export class ProviderUpstreamClientService {
  private readonly logger = new Logger(ProviderUpstreamClientService.name);
  private readonly upstreamBaseUrl =
    process.env.HRMS_SERVICE_URL ||
    'http://hrms-service:3017/api';
  private readonly requestTimeoutMs = parseInt(
    process.env.UPSTREAM_REQUEST_TIMEOUT_MS || '500',
    10,
  );
  private readonly errorThreshold = 0.5;
  private readonly resetTimeoutMs = 30_000;
  private readonly healthCheckPath = '/api/health';

  private state: BreakerState = 'CLOSED';
  private failures = 0;
  private successes = 0;
  private openedAt = 0;

  private recordSuccess(): void {
    this.successes++;
    if (this.state !== 'CLOSED') {
      this.logger.log('Upstream hrms:person recuperado: breaker → CLOSED');
      this.state = 'CLOSED';
      this.failures = 0;
    }
  }

  private recordFailure(): void {
    this.failures++;
    const total = this.failures + this.successes;
    if (total >= 4 && this.failures / total >= this.errorThreshold) {
      if (this.state !== 'OPEN') {
        this.logger.warn('Upstream hrms:person inestable: breaker → OPEN');
        this.state = 'OPEN';
        this.openedAt = Date.now();
      }
    }
  }

  private canAttempt(): boolean {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt >= this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.logger.log('Upstream breaker → HALF_OPEN (probe)');
        return true;
      }
      return false;
    }
    return true;
  }

  async isUpstreamHealthy(): Promise<boolean> {
    if (!this.canAttempt()) return false;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), this.requestTimeoutMs);
      const res = await fetch(this.upstreamBaseUrl + this.healthCheckPath, {
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (res.ok) {
        this.recordSuccess();
        return true;
      }
      this.recordFailure();
      return false;
    } catch (err: any) {
      this.recordFailure();
      this.logger.debug(`Upstream health check falló: ${err?.message ?? err}`);
      return false;
    }
  }

  async fetchUpstream<T = any>(relativePath: string): Promise<T | null> {
    if (!this.canAttempt()) return null;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), this.requestTimeoutMs);
      const res = await fetch(this.upstreamBaseUrl + relativePath, {
        signal: ctrl.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(t);
      if (!res.ok) {
        this.recordFailure();
        return null;
      }
      this.recordSuccess();
      return (await res.json()) as T;
    } catch (err: any) {
      this.recordFailure();
      this.logger.debug(`fetchUpstream error: ${err?.message ?? err}`);
      return null;
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      openedAt: this.openedAt,
    };
  }
}
