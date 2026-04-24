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
  SubscriptionPlanCreatedEvent,
  SubscriptionPlanUpdatedEvent,
  SubscriptionPlanDeletedEvent,
  PlanCreatedEvent,
  PlanUpdatedEvent,
  PlanDeletedEvent,
} from '../events/exporting.event';
import {
  SagaSubscriptionPlanFailedEvent
} from '../events/subscriptionplan-failed.event';
import {
  CreateSubscriptionPlanCommand,
  UpdateSubscriptionPlanCommand,
  DeleteSubscriptionPlanCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class SubscriptionPlanCrudSaga {
  private readonly logger = new Logger(SubscriptionPlanCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onSubscriptionPlanCreated = ($events: Observable<SubscriptionPlanCreatedEvent>) => {
    return $events.pipe(
      ofType(SubscriptionPlanCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de SubscriptionPlan: ${event.aggregateId}`);
        void this.handleSubscriptionPlanCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onSubscriptionPlanUpdated = ($events: Observable<SubscriptionPlanUpdatedEvent>) => {
    return $events.pipe(
      ofType(SubscriptionPlanUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de SubscriptionPlan: ${event.aggregateId}`);
        void this.handleSubscriptionPlanUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onSubscriptionPlanDeleted = ($events: Observable<SubscriptionPlanDeletedEvent>) => {
    return $events.pipe(
      ofType(SubscriptionPlanDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de SubscriptionPlan: ${event.aggregateId}`);
        void this.handleSubscriptionPlanDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPlanCreated = ($events: Observable<PlanCreatedEvent>) => {
    return $events.pipe(
      ofType(PlanCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PlanCreated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPlanUpdated = ($events: Observable<PlanUpdatedEvent>) => {
    return $events.pipe(
      ofType(PlanUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PlanUpdated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPlanDeleted = ($events: Observable<PlanDeletedEvent>) => {
    return $events.pipe(
      ofType(PlanDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PlanDeleted: ${event.aggregateId}`);
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
      .registerClient(SubscriptionPlanCrudSaga.name)
      .get(SubscriptionPlanCrudSaga.name),
  })
  private async handleSubscriptionPlanCreated(event: SubscriptionPlanCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga SubscriptionPlan Created completada: ${event.aggregateId}`);
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
      .registerClient(SubscriptionPlanCrudSaga.name)
      .get(SubscriptionPlanCrudSaga.name),
  })
  private async handleSubscriptionPlanUpdated(event: SubscriptionPlanUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga SubscriptionPlan Updated completada: ${event.aggregateId}`);
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
      .registerClient(SubscriptionPlanCrudSaga.name)
      .get(SubscriptionPlanCrudSaga.name),
  })
  private async handleSubscriptionPlanDeleted(event: SubscriptionPlanDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga SubscriptionPlan Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaSubscriptionPlanFailedEvent( error,event));
  }
}
