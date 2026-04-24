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
  CrmClientProfileCreatedEvent,
  CrmClientProfileUpdatedEvent,
  CrmClientProfileDeletedEvent,
  CrmClientProfileArchivedEvent,
} from '../events/exporting.event';
import {
  SagaCrmClientProfileFailedEvent
} from '../events/crmclientprofile-failed.event';
import {
  CreateCrmClientProfileCommand,
  UpdateCrmClientProfileCommand,
  DeleteCrmClientProfileCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class CrmClientProfileCrudSaga {
  private readonly logger = new Logger(CrmClientProfileCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onCrmClientProfileCreated = ($events: Observable<CrmClientProfileCreatedEvent>) => {
    return $events.pipe(
      ofType(CrmClientProfileCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de CrmClientProfile: ${event.aggregateId}`);
        void this.handleCrmClientProfileCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onCrmClientProfileUpdated = ($events: Observable<CrmClientProfileUpdatedEvent>) => {
    return $events.pipe(
      ofType(CrmClientProfileUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de CrmClientProfile: ${event.aggregateId}`);
        void this.handleCrmClientProfileUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onCrmClientProfileDeleted = ($events: Observable<CrmClientProfileDeletedEvent>) => {
    return $events.pipe(
      ofType(CrmClientProfileDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de CrmClientProfile: ${event.aggregateId}`);
        void this.handleCrmClientProfileDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onCrmClientProfileArchived = ($events: Observable<CrmClientProfileArchivedEvent>) => {
    return $events.pipe(
      ofType(CrmClientProfileArchivedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio CrmClientProfileArchived: ${event.aggregateId}`);
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
      .registerClient(CrmClientProfileCrudSaga.name)
      .get(CrmClientProfileCrudSaga.name),
  })
  private async handleCrmClientProfileCreated(event: CrmClientProfileCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CrmClientProfile Created completada: ${event.aggregateId}`);
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
      .registerClient(CrmClientProfileCrudSaga.name)
      .get(CrmClientProfileCrudSaga.name),
  })
  private async handleCrmClientProfileUpdated(event: CrmClientProfileUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CrmClientProfile Updated completada: ${event.aggregateId}`);
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
      .registerClient(CrmClientProfileCrudSaga.name)
      .get(CrmClientProfileCrudSaga.name),
  })
  private async handleCrmClientProfileDeleted(event: CrmClientProfileDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CrmClientProfile Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaCrmClientProfileFailedEvent( error,event));
  }
}
