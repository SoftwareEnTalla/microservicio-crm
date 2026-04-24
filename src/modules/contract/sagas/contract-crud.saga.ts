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
  ContractCreatedEvent,
  ContractUpdatedEvent,
  ContractDeletedEvent,
  ContractSignedEvent,
  ContractRenewedEvent,
  ContractSuspendedEvent,
  ContractTerminatedEvent,
  ContractExpiredEvent,
} from '../events/exporting.event';
import {
  SagaContractFailedEvent
} from '../events/contract-failed.event';
import {
  CreateContractCommand,
  UpdateContractCommand,
  DeleteContractCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ContractCrudSaga {
  private readonly logger = new Logger(ContractCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onContractCreated = ($events: Observable<ContractCreatedEvent>) => {
    return $events.pipe(
      ofType(ContractCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Contract: ${event.aggregateId}`);
        void this.handleContractCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onContractUpdated = ($events: Observable<ContractUpdatedEvent>) => {
    return $events.pipe(
      ofType(ContractUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Contract: ${event.aggregateId}`);
        void this.handleContractUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onContractDeleted = ($events: Observable<ContractDeletedEvent>) => {
    return $events.pipe(
      ofType(ContractDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Contract: ${event.aggregateId}`);
        void this.handleContractDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onContractSigned = ($events: Observable<ContractSignedEvent>) => {
    return $events.pipe(
      ofType(ContractSignedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ContractSigned: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onContractRenewed = ($events: Observable<ContractRenewedEvent>) => {
    return $events.pipe(
      ofType(ContractRenewedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ContractRenewed: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onContractSuspended = ($events: Observable<ContractSuspendedEvent>) => {
    return $events.pipe(
      ofType(ContractSuspendedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ContractSuspended: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onContractTerminated = ($events: Observable<ContractTerminatedEvent>) => {
    return $events.pipe(
      ofType(ContractTerminatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ContractTerminated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onContractExpired = ($events: Observable<ContractExpiredEvent>) => {
    return $events.pipe(
      ofType(ContractExpiredEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ContractExpired: ${event.aggregateId}`);
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
      .registerClient(ContractCrudSaga.name)
      .get(ContractCrudSaga.name),
  })
  private async handleContractCreated(event: ContractCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Contract Created completada: ${event.aggregateId}`);
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
      .registerClient(ContractCrudSaga.name)
      .get(ContractCrudSaga.name),
  })
  private async handleContractUpdated(event: ContractUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Contract Updated completada: ${event.aggregateId}`);
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
      .registerClient(ContractCrudSaga.name)
      .get(ContractCrudSaga.name),
  })
  private async handleContractDeleted(event: ContractDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Contract Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaContractFailedEvent( error,event));
  }
}
