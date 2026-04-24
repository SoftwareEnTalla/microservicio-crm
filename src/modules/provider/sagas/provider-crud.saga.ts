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
  ProviderCreatedEvent,
  ProviderUpdatedEvent,
  ProviderDeletedEvent,
  ProviderRatingUpdatedEvent,
} from '../events/exporting.event';
import {
  SagaProviderFailedEvent
} from '../events/provider-failed.event';
import {
  CreateProviderCommand,
  UpdateProviderCommand,
  DeleteProviderCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ProviderCrudSaga {
  private readonly logger = new Logger(ProviderCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onProviderCreated = ($events: Observable<ProviderCreatedEvent>) => {
    return $events.pipe(
      ofType(ProviderCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Provider: ${event.aggregateId}`);
        void this.handleProviderCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onProviderUpdated = ($events: Observable<ProviderUpdatedEvent>) => {
    return $events.pipe(
      ofType(ProviderUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Provider: ${event.aggregateId}`);
        void this.handleProviderUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onProviderDeleted = ($events: Observable<ProviderDeletedEvent>) => {
    return $events.pipe(
      ofType(ProviderDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Provider: ${event.aggregateId}`);
        void this.handleProviderDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onProviderRatingUpdated = ($events: Observable<ProviderRatingUpdatedEvent>) => {
    return $events.pipe(
      ofType(ProviderRatingUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ProviderRatingUpdated: ${event.aggregateId}`);
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
      .registerClient(ProviderCrudSaga.name)
      .get(ProviderCrudSaga.name),
  })
  private async handleProviderCreated(event: ProviderCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Provider Created completada: ${event.aggregateId}`);
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
      .registerClient(ProviderCrudSaga.name)
      .get(ProviderCrudSaga.name),
  })
  private async handleProviderUpdated(event: ProviderUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Provider Updated completada: ${event.aggregateId}`);
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
      .registerClient(ProviderCrudSaga.name)
      .get(ProviderCrudSaga.name),
  })
  private async handleProviderDeleted(event: ProviderDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Provider Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaProviderFailedEvent( error,event));
  }
}
