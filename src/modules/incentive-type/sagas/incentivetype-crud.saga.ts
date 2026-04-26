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
  IncentiveTypeCreatedEvent,
  IncentiveTypeUpdatedEvent,
  IncentiveTypeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaIncentiveTypeFailedEvent
} from '../events/incentivetype-failed.event';
import {
  CreateIncentiveTypeCommand,
  UpdateIncentiveTypeCommand,
  DeleteIncentiveTypeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class IncentiveTypeCrudSaga {
  private readonly logger = new Logger(IncentiveTypeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onIncentiveTypeCreated = ($events: Observable<IncentiveTypeCreatedEvent>) => {
    return $events.pipe(
      ofType(IncentiveTypeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de IncentiveType: ${event.aggregateId}`);
        void this.handleIncentiveTypeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onIncentiveTypeUpdated = ($events: Observable<IncentiveTypeUpdatedEvent>) => {
    return $events.pipe(
      ofType(IncentiveTypeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de IncentiveType: ${event.aggregateId}`);
        void this.handleIncentiveTypeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onIncentiveTypeDeleted = ($events: Observable<IncentiveTypeDeletedEvent>) => {
    return $events.pipe(
      ofType(IncentiveTypeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de IncentiveType: ${event.aggregateId}`);
        void this.handleIncentiveTypeDeleted(event);
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
      .registerClient(IncentiveTypeCrudSaga.name)
      .get(IncentiveTypeCrudSaga.name),
  })
  private async handleIncentiveTypeCreated(event: IncentiveTypeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga IncentiveType Created completada: ${event.aggregateId}`);
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
      .registerClient(IncentiveTypeCrudSaga.name)
      .get(IncentiveTypeCrudSaga.name),
  })
  private async handleIncentiveTypeUpdated(event: IncentiveTypeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga IncentiveType Updated completada: ${event.aggregateId}`);
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
      .registerClient(IncentiveTypeCrudSaga.name)
      .get(IncentiveTypeCrudSaga.name),
  })
  private async handleIncentiveTypeDeleted(event: IncentiveTypeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga IncentiveType Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaIncentiveTypeFailedEvent( error,event));
  }
}
