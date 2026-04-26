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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  CrmClientProfileStatusCreatedEvent,
  CrmClientProfileStatusUpdatedEvent,
  CrmClientProfileStatusDeletedEvent,

} from '../events/exporting.event';
import {
  SagaCrmClientProfileStatusFailedEvent
} from '../events/crmclientprofilestatus-failed.event';
import {
  CreateCrmClientProfileStatusCommand,
  UpdateCrmClientProfileStatusCommand,
  DeleteCrmClientProfileStatusCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class CrmClientProfileStatusCrudSaga {
  private readonly logger = new Logger(CrmClientProfileStatusCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onCrmClientProfileStatusCreated = ($events: Observable<CrmClientProfileStatusCreatedEvent>) => {
    return $events.pipe(
      ofType(CrmClientProfileStatusCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de CrmClientProfileStatus: ${event.aggregateId}`);
        void this.handleCrmClientProfileStatusCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onCrmClientProfileStatusUpdated = ($events: Observable<CrmClientProfileStatusUpdatedEvent>) => {
    return $events.pipe(
      ofType(CrmClientProfileStatusUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de CrmClientProfileStatus: ${event.aggregateId}`);
        void this.handleCrmClientProfileStatusUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onCrmClientProfileStatusDeleted = ($events: Observable<CrmClientProfileStatusDeletedEvent>) => {
    return $events.pipe(
      ofType(CrmClientProfileStatusDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de CrmClientProfileStatus: ${event.aggregateId}`);
        void this.handleCrmClientProfileStatusDeleted(event);
      }),
      map(() => null)
    );
  };


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CrmClientProfileStatusCrudSaga.name)
      .get(CrmClientProfileStatusCrudSaga.name),
  })
  private async handleCrmClientProfileStatusCreated(event: CrmClientProfileStatusCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CrmClientProfileStatus Created completada: ${event.aggregateId}`);
      // Lógica post-creación (ej: enviar notificación, ejecutar comandos adicionales)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CrmClientProfileStatusCrudSaga.name)
      .get(CrmClientProfileStatusCrudSaga.name),
  })
  private async handleCrmClientProfileStatusUpdated(event: CrmClientProfileStatusUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CrmClientProfileStatus Updated completada: ${event.aggregateId}`);
      // Lógica post-actualización (ej: actualizar caché)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CrmClientProfileStatusCrudSaga.name)
      .get(CrmClientProfileStatusCrudSaga.name),
  })
  private async handleCrmClientProfileStatusDeleted(event: CrmClientProfileStatusDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CrmClientProfileStatus Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaCrmClientProfileStatusFailedEvent( error,event));
  }
}
