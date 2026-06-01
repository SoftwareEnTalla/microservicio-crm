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
  LeadCreatedEvent,
  LeadUpdatedEvent,
  LeadDeletedEvent,
  LeadAssignedEvent,
  LeadQualifiedEvent,
  LeadConvertedEvent,
} from '../events/exporting.event';
import {
  SagaLeadFailedEvent
} from '../events/lead-failed.event';
import {
  CreateLeadCommand,
  UpdateLeadCommand,
  DeleteLeadCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class LeadCrudSaga {
  private readonly logger = new Logger(LeadCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onLeadCreated = ($events: Observable<LeadCreatedEvent>) => {
    return $events.pipe(
      ofType(LeadCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Lead: ${event.aggregateId}`);
        void this.handleLeadCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onLeadUpdated = ($events: Observable<LeadUpdatedEvent>) => {
    return $events.pipe(
      ofType(LeadUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Lead: ${event.aggregateId}`);
        void this.handleLeadUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onLeadDeleted = ($events: Observable<LeadDeletedEvent>) => {
    return $events.pipe(
      ofType(LeadDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Lead: ${event.aggregateId}`);
        void this.handleLeadDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onLeadAssigned = ($events: Observable<LeadAssignedEvent>) => {
    return $events.pipe(
      ofType(LeadAssignedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio LeadAssigned: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onLeadQualified = ($events: Observable<LeadQualifiedEvent>) => {
    return $events.pipe(
      ofType(LeadQualifiedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio LeadQualified: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onLeadConverted = ($events: Observable<LeadConvertedEvent>) => {
    return $events.pipe(
      ofType(LeadConvertedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio LeadConverted: ${event.aggregateId}`);
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
      .registerClient(LeadCrudSaga.name)
      .get(LeadCrudSaga.name),
  })
  private async handleLeadCreated(event: LeadCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Lead Created completada: ${event.aggregateId}`);
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
      .registerClient(LeadCrudSaga.name)
      .get(LeadCrudSaga.name),
  })
  private async handleLeadUpdated(event: LeadUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Lead Updated completada: ${event.aggregateId}`);
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
      .registerClient(LeadCrudSaga.name)
      .get(LeadCrudSaga.name),
  })
  private async handleLeadDeleted(event: LeadDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Lead Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaLeadFailedEvent( error,event));
  }
}
