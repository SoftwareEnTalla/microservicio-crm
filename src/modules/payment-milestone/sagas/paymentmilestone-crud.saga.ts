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
  PaymentMilestoneCreatedEvent,
  PaymentMilestoneUpdatedEvent,
  PaymentMilestoneDeletedEvent,
  PaymentMilestoneStatusChangedEvent,
  PaymentMilestoneAcceptedEvent,
  PaymentMilestoneRejectedEvent,
  MilestoneReadyForInvoicingEvent,
  PaymentMilestoneInvoicedEvent,
} from '../events/exporting.event';
import {
  SagaPaymentMilestoneFailedEvent
} from '../events/paymentmilestone-failed.event';
import {
  CreatePaymentMilestoneCommand,
  UpdatePaymentMilestoneCommand,
  DeletePaymentMilestoneCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class PaymentMilestoneCrudSaga {
  private readonly logger = new Logger(PaymentMilestoneCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPaymentMilestoneCreated = ($events: Observable<PaymentMilestoneCreatedEvent>) => {
    return $events.pipe(
      ofType(PaymentMilestoneCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de PaymentMilestone: ${event.aggregateId}`);
        void this.handlePaymentMilestoneCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onPaymentMilestoneUpdated = ($events: Observable<PaymentMilestoneUpdatedEvent>) => {
    return $events.pipe(
      ofType(PaymentMilestoneUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de PaymentMilestone: ${event.aggregateId}`);
        void this.handlePaymentMilestoneUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPaymentMilestoneDeleted = ($events: Observable<PaymentMilestoneDeletedEvent>) => {
    return $events.pipe(
      ofType(PaymentMilestoneDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de PaymentMilestone: ${event.aggregateId}`);
        void this.handlePaymentMilestoneDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPaymentMilestoneStatusChanged = ($events: Observable<PaymentMilestoneStatusChangedEvent>) => {
    return $events.pipe(
      ofType(PaymentMilestoneStatusChangedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PaymentMilestoneStatusChanged: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPaymentMilestoneAccepted = ($events: Observable<PaymentMilestoneAcceptedEvent>) => {
    return $events.pipe(
      ofType(PaymentMilestoneAcceptedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PaymentMilestoneAccepted: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPaymentMilestoneRejected = ($events: Observable<PaymentMilestoneRejectedEvent>) => {
    return $events.pipe(
      ofType(PaymentMilestoneRejectedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PaymentMilestoneRejected: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onMilestoneReadyForInvoicing = ($events: Observable<MilestoneReadyForInvoicingEvent>) => {
    return $events.pipe(
      ofType(MilestoneReadyForInvoicingEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio MilestoneReadyForInvoicing: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPaymentMilestoneInvoiced = ($events: Observable<PaymentMilestoneInvoicedEvent>) => {
    return $events.pipe(
      ofType(PaymentMilestoneInvoicedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PaymentMilestoneInvoiced: ${event.aggregateId}`);
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
      .registerClient(PaymentMilestoneCrudSaga.name)
      .get(PaymentMilestoneCrudSaga.name),
  })
  private async handlePaymentMilestoneCreated(event: PaymentMilestoneCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentMilestone Created completada: ${event.aggregateId}`);
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
      .registerClient(PaymentMilestoneCrudSaga.name)
      .get(PaymentMilestoneCrudSaga.name),
  })
  private async handlePaymentMilestoneUpdated(event: PaymentMilestoneUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentMilestone Updated completada: ${event.aggregateId}`);
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
      .registerClient(PaymentMilestoneCrudSaga.name)
      .get(PaymentMilestoneCrudSaga.name),
  })
  private async handlePaymentMilestoneDeleted(event: PaymentMilestoneDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PaymentMilestone Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPaymentMilestoneFailedEvent( error,event));
  }
}
