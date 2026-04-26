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
  PersonTypeCreatedEvent,
  PersonTypeUpdatedEvent,
  PersonTypeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaPersonTypeFailedEvent
} from '../events/persontype-failed.event';
import {
  CreatePersonTypeCommand,
  UpdatePersonTypeCommand,
  DeletePersonTypeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class PersonTypeCrudSaga {
  private readonly logger = new Logger(PersonTypeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPersonTypeCreated = ($events: Observable<PersonTypeCreatedEvent>) => {
    return $events.pipe(
      ofType(PersonTypeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de PersonType: ${event.aggregateId}`);
        void this.handlePersonTypeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onPersonTypeUpdated = ($events: Observable<PersonTypeUpdatedEvent>) => {
    return $events.pipe(
      ofType(PersonTypeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de PersonType: ${event.aggregateId}`);
        void this.handlePersonTypeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPersonTypeDeleted = ($events: Observable<PersonTypeDeletedEvent>) => {
    return $events.pipe(
      ofType(PersonTypeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de PersonType: ${event.aggregateId}`);
        void this.handlePersonTypeDeleted(event);
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
      .registerClient(PersonTypeCrudSaga.name)
      .get(PersonTypeCrudSaga.name),
  })
  private async handlePersonTypeCreated(event: PersonTypeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PersonType Created completada: ${event.aggregateId}`);
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
      .registerClient(PersonTypeCrudSaga.name)
      .get(PersonTypeCrudSaga.name),
  })
  private async handlePersonTypeUpdated(event: PersonTypeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PersonType Updated completada: ${event.aggregateId}`);
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
      .registerClient(PersonTypeCrudSaga.name)
      .get(PersonTypeCrudSaga.name),
  })
  private async handlePersonTypeDeleted(event: PersonTypeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PersonType Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPersonTypeFailedEvent( error,event));
  }
}
