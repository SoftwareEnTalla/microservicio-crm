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
  ContactCreatedEvent,
  ContactUpdatedEvent,
  ContactDeletedEvent,
  ContactLinkedToAccountEvent,
} from '../events/exporting.event';
import {
  SagaContactFailedEvent
} from '../events/contact-failed.event';
import {
  CreateContactCommand,
  UpdateContactCommand,
  DeleteContactCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ContactCrudSaga {
  private readonly logger = new Logger(ContactCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onContactCreated = ($events: Observable<ContactCreatedEvent>) => {
    return $events.pipe(
      ofType(ContactCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Contact: ${event.aggregateId}`);
        void this.handleContactCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onContactUpdated = ($events: Observable<ContactUpdatedEvent>) => {
    return $events.pipe(
      ofType(ContactUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Contact: ${event.aggregateId}`);
        void this.handleContactUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onContactDeleted = ($events: Observable<ContactDeletedEvent>) => {
    return $events.pipe(
      ofType(ContactDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Contact: ${event.aggregateId}`);
        void this.handleContactDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onContactLinkedToAccount = ($events: Observable<ContactLinkedToAccountEvent>) => {
    return $events.pipe(
      ofType(ContactLinkedToAccountEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ContactLinkedToAccount: ${event.aggregateId}`);
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
      .registerClient(ContactCrudSaga.name)
      .get(ContactCrudSaga.name),
  })
  private async handleContactCreated(event: ContactCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Contact Created completada: ${event.aggregateId}`);
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
      .registerClient(ContactCrudSaga.name)
      .get(ContactCrudSaga.name),
  })
  private async handleContactUpdated(event: ContactUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Contact Updated completada: ${event.aggregateId}`);
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
      .registerClient(ContactCrudSaga.name)
      .get(ContactCrudSaga.name),
  })
  private async handleContactDeleted(event: ContactDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Contact Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaContactFailedEvent( error,event));
  }
}
