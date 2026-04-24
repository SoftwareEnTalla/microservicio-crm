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
 * Endpoint de búsqueda por similitud contra hrms:person.
 * Devuelve candidatos upstream para reutilización antes de crear un
 * Provider nuevo (flujo anti-duplicación).
 *
 * Algoritmo: pg_trgm+tsvector (delegado al upstream service).
 * Campos indexados: name,taxId,firstName,lastName,documentNumber,email,phone
 */
import { Controller, Get, Query, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { ProviderUpstreamClientService } from '../services/provider-upstream-client.service';

const SIMILARITY_FIELDS: string[] = ['name', 'taxId', 'firstName', 'lastName', 'documentNumber', 'email', 'phone'];
const DEFAULT_MAX = 20;

@ApiTags('provider')
@Controller('providers')
export class ProviderUpstreamSearchController {
  constructor(private readonly upstreamClient: ProviderUpstreamClientService) {}

  @Get('search-upstream-candidates')
  @ApiOperation({
    summary:
      'Busca candidatos en upstream hrms:person por similitud (nombre, documento, email, teléfono).',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Texto a buscar' })
  @ApiQuery({ name: 'types', required: false, description: 'CSV de tipos: name,document,email,phone' })
  @ApiQuery({ name: 'limit', required: false, description: 'Máximo de resultados (default ' + DEFAULT_MAX + ')' })
  async searchCandidates(
    @Query('q') q: string,
    @Query('types') types: string | undefined,
    @Query('limit') limit: string | undefined,
    @Res() res: Response,
  ) {
    const healthy = await this.upstreamClient.isUpstreamHealthy();
    if (!healthy) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'UPSTREAM_DOWN',
        message:
          'El upstream hrms:person no está disponible; no se pueden listar candidatos. Se puede proceder con alta LOCAL_ONLY.',
        candidates: [],
      });
    }
    const search = new URLSearchParams();
    if (q) search.set('q', q);
    if (types) search.set('types', types);
    search.set('limit', String(parseInt(limit || String(DEFAULT_MAX), 10)));
    const relative =
      '/persons/query/search-similarity?' + search.toString();
    const result = await this.upstreamClient.fetchUpstream<any>(relative);
    return res.status(HttpStatus.OK).json({
      status: 'OK',
      indexedFields: SIMILARITY_FIELDS,
      candidates: (result as any)?.data ?? result ?? [],
    });
  }
}
