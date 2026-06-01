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
  AccountCreatedEvent,
  AccountUpdatedEvent,
  AccountDeletedEvent,
  AccountOwnerChangedEvent,
  AccountDeactivatedEvent,
} from '../events/exporting.event';
import {
  SagaAccountFailedEvent
} from '../events/account-failed.event';
import {
  CreateAccountCommand,
  UpdateAccountCommand,
  DeleteAccountCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class AccountCrudSaga {
  private readonly logger = new Logger(AccountCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onAccountCreated = ($events: Observable<AccountCreatedEvent>) => {
    return $events.pipe(
      ofType(AccountCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Account: ${event.aggregateId}`);
        void this.handleAccountCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onAccountUpdated = ($events: Observable<AccountUpdatedEvent>) => {
    return $events.pipe(
      ofType(AccountUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Account: ${event.aggregateId}`);
        void this.handleAccountUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onAccountDeleted = ($events: Observable<AccountDeletedEvent>) => {
    return $events.pipe(
      ofType(AccountDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Account: ${event.aggregateId}`);
        void this.handleAccountDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onAccountOwnerChanged = ($events: Observable<AccountOwnerChangedEvent>) => {
    return $events.pipe(
      ofType(AccountOwnerChangedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio AccountOwnerChanged: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onAccountDeactivated = ($events: Observable<AccountDeactivatedEvent>) => {
    return $events.pipe(
      ofType(AccountDeactivatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio AccountDeactivated: ${event.aggregateId}`);
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
      .registerClient(AccountCrudSaga.name)
      .get(AccountCrudSaga.name),
  })
  private async handleAccountCreated(event: AccountCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Account Created completada: ${event.aggregateId}`);
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
      .registerClient(AccountCrudSaga.name)
      .get(AccountCrudSaga.name),
  })
  private async handleAccountUpdated(event: AccountUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Account Updated completada: ${event.aggregateId}`);
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
      .registerClient(AccountCrudSaga.name)
      .get(AccountCrudSaga.name),
  })
  private async handleAccountDeleted(event: AccountDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Account Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaAccountFailedEvent( error,event));
  }
}
