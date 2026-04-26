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
  BillingCycleCreatedEvent,
  BillingCycleUpdatedEvent,
  BillingCycleDeletedEvent,

} from '../events/exporting.event';
import {
  SagaBillingCycleFailedEvent
} from '../events/billingcycle-failed.event';
import {
  CreateBillingCycleCommand,
  UpdateBillingCycleCommand,
  DeleteBillingCycleCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class BillingCycleCrudSaga {
  private readonly logger = new Logger(BillingCycleCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onBillingCycleCreated = ($events: Observable<BillingCycleCreatedEvent>) => {
    return $events.pipe(
      ofType(BillingCycleCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de BillingCycle: ${event.aggregateId}`);
        void this.handleBillingCycleCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onBillingCycleUpdated = ($events: Observable<BillingCycleUpdatedEvent>) => {
    return $events.pipe(
      ofType(BillingCycleUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de BillingCycle: ${event.aggregateId}`);
        void this.handleBillingCycleUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onBillingCycleDeleted = ($events: Observable<BillingCycleDeletedEvent>) => {
    return $events.pipe(
      ofType(BillingCycleDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de BillingCycle: ${event.aggregateId}`);
        void this.handleBillingCycleDeleted(event);
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
      .registerClient(BillingCycleCrudSaga.name)
      .get(BillingCycleCrudSaga.name),
  })
  private async handleBillingCycleCreated(event: BillingCycleCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga BillingCycle Created completada: ${event.aggregateId}`);
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
      .registerClient(BillingCycleCrudSaga.name)
      .get(BillingCycleCrudSaga.name),
  })
  private async handleBillingCycleUpdated(event: BillingCycleUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga BillingCycle Updated completada: ${event.aggregateId}`);
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
      .registerClient(BillingCycleCrudSaga.name)
      .get(BillingCycleCrudSaga.name),
  })
  private async handleBillingCycleDeleted(event: BillingCycleDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga BillingCycle Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaBillingCycleFailedEvent( error,event));
  }
}
