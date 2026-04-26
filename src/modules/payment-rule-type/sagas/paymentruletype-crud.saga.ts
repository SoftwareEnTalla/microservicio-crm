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
  PaymentRuleTypeCreatedEvent,
  PaymentRuleTypeUpdatedEvent,
  PaymentRuleTypeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaPaymentRuleTypeFailedEvent
} from '../events/paymentruletype-failed.event';
import {
  CreatePaymentRuleTypeCommand,
  UpdatePaymentRuleTypeCommand,
  DeletePaymentRuleTypeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class PaymentRuleTypeCrudSaga {
  private readonly logger = new Logger(PaymentRuleTypeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPaymentRuleTypeCreated = ($events: Observable<PaymentRuleTypeCreatedEvent>) => {
    return $events.pipe(
      ofType(PaymentRuleTypeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de PaymentRuleType: ${event.aggregateId}`);
        void this.handlePaymentRuleTypeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onPaymentRuleTypeUpdated = ($events: Observable<PaymentRuleTypeUpdatedEvent>) => {
    return $events.pipe(
      ofType(PaymentRuleTypeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de PaymentRuleType: ${event.aggregateId}`);
        void this.handlePaymentRuleTypeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPaymentRuleTypeDeleted = ($events: Observable<PaymentRuleTypeDeletedEvent>) => {
    return $events.pipe(
      ofType(PaymentRuleTypeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de PaymentRuleType: ${event.aggregateId}`);
        void this.handlePaymentRuleTypeDeleted(event);
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
      .registerClient(PaymentRuleTypeCrudSaga.name)
      .get(PaymentRuleTypeCrudSaga.name),
  })
  private async handlePaymentRuleTypeCreated(event: PaymentRuleTypeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentRuleType Created completada: ${event.aggregateId}`);
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
      .registerClient(PaymentRuleTypeCrudSaga.name)
      .get(PaymentRuleTypeCrudSaga.name),
  })
  private async handlePaymentRuleTypeUpdated(event: PaymentRuleTypeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentRuleType Updated completada: ${event.aggregateId}`);
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
      .registerClient(PaymentRuleTypeCrudSaga.name)
      .get(PaymentRuleTypeCrudSaga.name),
  })
  private async handlePaymentRuleTypeDeleted(event: PaymentRuleTypeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentRuleType Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPaymentRuleTypeFailedEvent( error,event));
  }
}
