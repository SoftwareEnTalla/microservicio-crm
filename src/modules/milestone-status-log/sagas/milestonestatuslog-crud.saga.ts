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
  MilestoneStatusLogCreatedEvent,
  MilestoneStatusLogUpdatedEvent,
  MilestoneStatusLogDeletedEvent,

} from '../events/exporting.event';
import {
  SagaMilestoneStatusLogFailedEvent
} from '../events/milestonestatuslog-failed.event';
import {
  CreateMilestoneStatusLogCommand,
  UpdateMilestoneStatusLogCommand,
  DeleteMilestoneStatusLogCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class MilestoneStatusLogCrudSaga {
  private readonly logger = new Logger(MilestoneStatusLogCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onMilestoneStatusLogCreated = ($events: Observable<MilestoneStatusLogCreatedEvent>) => {
    return $events.pipe(
      ofType(MilestoneStatusLogCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de MilestoneStatusLog: ${event.aggregateId}`);
        void this.handleMilestoneStatusLogCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onMilestoneStatusLogUpdated = ($events: Observable<MilestoneStatusLogUpdatedEvent>) => {
    return $events.pipe(
      ofType(MilestoneStatusLogUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de MilestoneStatusLog: ${event.aggregateId}`);
        void this.handleMilestoneStatusLogUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onMilestoneStatusLogDeleted = ($events: Observable<MilestoneStatusLogDeletedEvent>) => {
    return $events.pipe(
      ofType(MilestoneStatusLogDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de MilestoneStatusLog: ${event.aggregateId}`);
        void this.handleMilestoneStatusLogDeleted(event);
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
      .registerClient(MilestoneStatusLogCrudSaga.name)
      .get(MilestoneStatusLogCrudSaga.name),
  })
  private async handleMilestoneStatusLogCreated(event: MilestoneStatusLogCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MilestoneStatusLog Created completada: ${event.aggregateId}`);
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
      .registerClient(MilestoneStatusLogCrudSaga.name)
      .get(MilestoneStatusLogCrudSaga.name),
  })
  private async handleMilestoneStatusLogUpdated(event: MilestoneStatusLogUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MilestoneStatusLog Updated completada: ${event.aggregateId}`);
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
      .registerClient(MilestoneStatusLogCrudSaga.name)
      .get(MilestoneStatusLogCrudSaga.name),
  })
  private async handleMilestoneStatusLogDeleted(event: MilestoneStatusLogDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MilestoneStatusLog Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaMilestoneStatusLogFailedEvent( error,event));
  }
}
