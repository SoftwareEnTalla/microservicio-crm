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
  TermsAndConditionCreatedEvent,
  TermsAndConditionUpdatedEvent,
  TermsAndConditionDeletedEvent,
  TermsCreatedEvent,
  TermsUpdatedEvent,
  TermsVersionActivatedEvent,
} from '../events/exporting.event';
import {
  SagaTermsAndConditionFailedEvent
} from '../events/termsandcondition-failed.event';
import {
  CreateTermsAndConditionCommand,
  UpdateTermsAndConditionCommand,
  DeleteTermsAndConditionCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class TermsAndConditionCrudSaga {
  private readonly logger = new Logger(TermsAndConditionCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onTermsAndConditionCreated = ($events: Observable<TermsAndConditionCreatedEvent>) => {
    return $events.pipe(
      ofType(TermsAndConditionCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de TermsAndCondition: ${event.aggregateId}`);
        void this.handleTermsAndConditionCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onTermsAndConditionUpdated = ($events: Observable<TermsAndConditionUpdatedEvent>) => {
    return $events.pipe(
      ofType(TermsAndConditionUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de TermsAndCondition: ${event.aggregateId}`);
        void this.handleTermsAndConditionUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onTermsAndConditionDeleted = ($events: Observable<TermsAndConditionDeletedEvent>) => {
    return $events.pipe(
      ofType(TermsAndConditionDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de TermsAndCondition: ${event.aggregateId}`);
        void this.handleTermsAndConditionDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTermsCreated = ($events: Observable<TermsCreatedEvent>) => {
    return $events.pipe(
      ofType(TermsCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TermsCreated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTermsUpdated = ($events: Observable<TermsUpdatedEvent>) => {
    return $events.pipe(
      ofType(TermsUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TermsUpdated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTermsVersionActivated = ($events: Observable<TermsVersionActivatedEvent>) => {
    return $events.pipe(
      ofType(TermsVersionActivatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TermsVersionActivated: ${event.aggregateId}`);
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
      .registerClient(TermsAndConditionCrudSaga.name)
      .get(TermsAndConditionCrudSaga.name),
  })
  private async handleTermsAndConditionCreated(event: TermsAndConditionCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TermsAndCondition Created completada: ${event.aggregateId}`);
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
      .registerClient(TermsAndConditionCrudSaga.name)
      .get(TermsAndConditionCrudSaga.name),
  })
  private async handleTermsAndConditionUpdated(event: TermsAndConditionUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TermsAndCondition Updated completada: ${event.aggregateId}`);
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
      .registerClient(TermsAndConditionCrudSaga.name)
      .get(TermsAndConditionCrudSaga.name),
  })
  private async handleTermsAndConditionDeleted(event: TermsAndConditionDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TermsAndCondition Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaTermsAndConditionFailedEvent( error,event));
  }
}
