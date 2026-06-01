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
  OpportunityCreatedEvent,
  OpportunityUpdatedEvent,
  OpportunityDeletedEvent,
  OpportunityStageChangedEvent,
  OpportunityWonEvent,
  OpportunityLostEvent,
} from '../events/exporting.event';
import {
  SagaOpportunityFailedEvent
} from '../events/opportunity-failed.event';
import {
  CreateOpportunityCommand,
  UpdateOpportunityCommand,
  DeleteOpportunityCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class OpportunityCrudSaga {
  private readonly logger = new Logger(OpportunityCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onOpportunityCreated = ($events: Observable<OpportunityCreatedEvent>) => {
    return $events.pipe(
      ofType(OpportunityCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Opportunity: ${event.aggregateId}`);
        void this.handleOpportunityCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onOpportunityUpdated = ($events: Observable<OpportunityUpdatedEvent>) => {
    return $events.pipe(
      ofType(OpportunityUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Opportunity: ${event.aggregateId}`);
        void this.handleOpportunityUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onOpportunityDeleted = ($events: Observable<OpportunityDeletedEvent>) => {
    return $events.pipe(
      ofType(OpportunityDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Opportunity: ${event.aggregateId}`);
        void this.handleOpportunityDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onOpportunityStageChanged = ($events: Observable<OpportunityStageChangedEvent>) => {
    return $events.pipe(
      ofType(OpportunityStageChangedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio OpportunityStageChanged: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onOpportunityWon = ($events: Observable<OpportunityWonEvent>) => {
    return $events.pipe(
      ofType(OpportunityWonEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio OpportunityWon: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onOpportunityLost = ($events: Observable<OpportunityLostEvent>) => {
    return $events.pipe(
      ofType(OpportunityLostEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio OpportunityLost: ${event.aggregateId}`);
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
      .registerClient(OpportunityCrudSaga.name)
      .get(OpportunityCrudSaga.name),
  })
  private async handleOpportunityCreated(event: OpportunityCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Opportunity Created completada: ${event.aggregateId}`);
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
      .registerClient(OpportunityCrudSaga.name)
      .get(OpportunityCrudSaga.name),
  })
  private async handleOpportunityUpdated(event: OpportunityUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Opportunity Updated completada: ${event.aggregateId}`);
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
      .registerClient(OpportunityCrudSaga.name)
      .get(OpportunityCrudSaga.name),
  })
  private async handleOpportunityDeleted(event: OpportunityDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Opportunity Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaOpportunityFailedEvent( error,event));
  }
}
