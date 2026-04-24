/*
 * Cross-service saga: reacciona a eventos externos provenientes de client-service
 * y los transforma en comandos locales del contexto CRM.
 */

import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  ClientCreatedExternalEvent,
  ClientUpdatedExternalEvent,
  ClientDeletedExternalEvent,
} from '../events/external.events';
import {
  CreateCrmClientProfileCommand,
  UpdateCrmClientProfileCommand,
  DeleteCrmClientProfileCommand,
} from '../commands/exporting.command';

@Injectable()
export class CrmClientProfileCrossServiceSaga {
  private readonly logger = new Logger(CrmClientProfileCrossServiceSaga.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Saga()
  onExternalClientCreated = ($events: Observable<ClientCreatedExternalEvent>) => {
    return $events.pipe(
      ofType(ClientCreatedExternalEvent),
      tap((event) => {
        this.logger.log(`Cross-service: ClientCreated -> UpsertCrmClientProfile (${event.aggregateId})`);
        void this.commandBus.execute(new CreateCrmClientProfileCommand(event.payload, event.payload));
      }),
      map(() => null),
    );
  };

  @Saga()
  onExternalClientUpdated = ($events: Observable<ClientUpdatedExternalEvent>) => {
    return $events.pipe(
      ofType(ClientUpdatedExternalEvent),
      tap((event) => {
        this.logger.log(`Cross-service: ClientUpdated -> RefreshCrmClientProfile (${event.aggregateId})`);
        void this.commandBus.execute(new UpdateCrmClientProfileCommand(event.payload, event.payload));
      }),
      map(() => null),
    );
  };

  @Saga()
  onExternalClientDeleted = ($events: Observable<ClientDeletedExternalEvent>) => {
    return $events.pipe(
      ofType(ClientDeletedExternalEvent),
      tap((event) => {
        this.logger.log(`Cross-service: ClientDeleted -> ArchiveCrmClientProfile (${event.aggregateId})`);
        void this.commandBus.execute(new DeleteCrmClientProfileCommand(event.payload, event.payload));
      }),
      map(() => null),
    );
  };
}
