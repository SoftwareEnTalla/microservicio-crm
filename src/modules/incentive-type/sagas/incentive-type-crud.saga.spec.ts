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

import { of, lastValueFrom } from 'rxjs';
import { describe, expect, it, jest } from '@jest/globals';
import { IncentiveTypeCrudSaga } from './incentive-type-crud.saga';
import { IncentiveTypeCreatedEvent } from '../events/incentivetypecreated.event';

describe('IncentiveTypeCrudSaga', () => {
  it('reacciona al evento de creación sin romper el flujo CQRS', async () => {
    const saga = new IncentiveTypeCrudSaga({ execute: jest.fn() } as any, { publish: jest.fn() } as any);
    const event = new IncentiveTypeCreatedEvent('agg-1', {
      instance: { id: 'agg-1' } as any,
      metadata: { initiatedBy: 'test', correlationId: 'agg-1' },
    });

    const result = await lastValueFrom(saga.onIncentiveTypeCreated(of(event)));
    expect(result).toBeNull();
  });
});
