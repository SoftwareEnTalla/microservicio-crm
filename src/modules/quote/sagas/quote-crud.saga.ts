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
  QuoteCreatedEvent,
  QuoteUpdatedEvent,
  QuoteDeletedEvent,
  QuoteSentEvent,
  QuoteAcceptedEvent,
  QuoteRejectedEvent,
} from '../events/exporting.event';
import {
  SagaQuoteFailedEvent
} from '../events/quote-failed.event';
import {
  CreateQuoteCommand,
  UpdateQuoteCommand,
  DeleteQuoteCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class QuoteCrudSaga {
  private readonly logger = new Logger(QuoteCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onQuoteCreated = ($events: Observable<QuoteCreatedEvent>) => {
    return $events.pipe(
      ofType(QuoteCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Quote: ${event.aggregateId}`);
        void this.handleQuoteCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onQuoteUpdated = ($events: Observable<QuoteUpdatedEvent>) => {
    return $events.pipe(
      ofType(QuoteUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Quote: ${event.aggregateId}`);
        void this.handleQuoteUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onQuoteDeleted = ($events: Observable<QuoteDeletedEvent>) => {
    return $events.pipe(
      ofType(QuoteDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Quote: ${event.aggregateId}`);
        void this.handleQuoteDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onQuoteSent = ($events: Observable<QuoteSentEvent>) => {
    return $events.pipe(
      ofType(QuoteSentEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio QuoteSent: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onQuoteAccepted = ($events: Observable<QuoteAcceptedEvent>) => {
    return $events.pipe(
      ofType(QuoteAcceptedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio QuoteAccepted: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onQuoteRejected = ($events: Observable<QuoteRejectedEvent>) => {
    return $events.pipe(
      ofType(QuoteRejectedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio QuoteRejected: ${event.aggregateId}`);
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
      .registerClient(QuoteCrudSaga.name)
      .get(QuoteCrudSaga.name),
  })
  private async handleQuoteCreated(event: QuoteCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Quote Created completada: ${event.aggregateId}`);
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
      .registerClient(QuoteCrudSaga.name)
      .get(QuoteCrudSaga.name),
  })
  private async handleQuoteUpdated(event: QuoteUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Quote Updated completada: ${event.aggregateId}`);
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
      .registerClient(QuoteCrudSaga.name)
      .get(QuoteCrudSaga.name),
  })
  private async handleQuoteDeleted(event: QuoteDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Quote Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaQuoteFailedEvent( error,event));
  }
}
