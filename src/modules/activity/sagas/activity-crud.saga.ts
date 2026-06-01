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
  ActivityCreatedEvent,
  ActivityUpdatedEvent,
  ActivityDeletedEvent,
  ActivityCompletedEvent,
} from '../events/exporting.event';
import {
  SagaActivityFailedEvent
} from '../events/activity-failed.event';
import {
  CreateActivityCommand,
  UpdateActivityCommand,
  DeleteActivityCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ActivityCrudSaga {
  private readonly logger = new Logger(ActivityCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onActivityCreated = ($events: Observable<ActivityCreatedEvent>) => {
    return $events.pipe(
      ofType(ActivityCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Activity: ${event.aggregateId}`);
        void this.handleActivityCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onActivityUpdated = ($events: Observable<ActivityUpdatedEvent>) => {
    return $events.pipe(
      ofType(ActivityUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Activity: ${event.aggregateId}`);
        void this.handleActivityUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onActivityDeleted = ($events: Observable<ActivityDeletedEvent>) => {
    return $events.pipe(
      ofType(ActivityDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Activity: ${event.aggregateId}`);
        void this.handleActivityDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onActivityCompleted = ($events: Observable<ActivityCompletedEvent>) => {
    return $events.pipe(
      ofType(ActivityCompletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ActivityCompleted: ${event.aggregateId}`);
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
      .registerClient(ActivityCrudSaga.name)
      .get(ActivityCrudSaga.name),
  })
  private async handleActivityCreated(event: ActivityCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Activity Created completada: ${event.aggregateId}`);
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
      .registerClient(ActivityCrudSaga.name)
      .get(ActivityCrudSaga.name),
  })
  private async handleActivityUpdated(event: ActivityUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Activity Updated completada: ${event.aggregateId}`);
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
      .registerClient(ActivityCrudSaga.name)
      .get(ActivityCrudSaga.name),
  })
  private async handleActivityDeleted(event: ActivityDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Activity Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaActivityFailedEvent( error,event));
  }
}
