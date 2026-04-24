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
  IncentiveCreatedEvent,
  IncentiveUpdatedEvent,
  IncentiveDeletedEvent,
  IncentiveAppliedEvent,
} from '../events/exporting.event';
import {
  SagaIncentiveFailedEvent
} from '../events/incentive-failed.event';
import {
  CreateIncentiveCommand,
  UpdateIncentiveCommand,
  DeleteIncentiveCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class IncentiveCrudSaga {
  private readonly logger = new Logger(IncentiveCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onIncentiveCreated = ($events: Observable<IncentiveCreatedEvent>) => {
    return $events.pipe(
      ofType(IncentiveCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Incentive: ${event.aggregateId}`);
        void this.handleIncentiveCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onIncentiveUpdated = ($events: Observable<IncentiveUpdatedEvent>) => {
    return $events.pipe(
      ofType(IncentiveUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Incentive: ${event.aggregateId}`);
        void this.handleIncentiveUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onIncentiveDeleted = ($events: Observable<IncentiveDeletedEvent>) => {
    return $events.pipe(
      ofType(IncentiveDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Incentive: ${event.aggregateId}`);
        void this.handleIncentiveDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onIncentiveApplied = ($events: Observable<IncentiveAppliedEvent>) => {
    return $events.pipe(
      ofType(IncentiveAppliedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio IncentiveApplied: ${event.aggregateId}`);
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
      .registerClient(IncentiveCrudSaga.name)
      .get(IncentiveCrudSaga.name),
  })
  private async handleIncentiveCreated(event: IncentiveCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Incentive Created completada: ${event.aggregateId}`);
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
      .registerClient(IncentiveCrudSaga.name)
      .get(IncentiveCrudSaga.name),
  })
  private async handleIncentiveUpdated(event: IncentiveUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Incentive Updated completada: ${event.aggregateId}`);
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
      .registerClient(IncentiveCrudSaga.name)
      .get(IncentiveCrudSaga.name),
  })
  private async handleIncentiveDeleted(event: IncentiveDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Incentive Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaIncentiveFailedEvent( error,event));
  }
}
