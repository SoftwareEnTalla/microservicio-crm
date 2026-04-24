/*
 * External cross-service events consumed from client-service via Kafka.
 * Topics: client.client-created / client.client-updated / client.client-deleted.
 */

import { BaseEvent, PayloadEvent } from './base.event';

export class ClientCreatedExternalEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<any>) {
    super(aggregateId);
  }
}

export class ClientUpdatedExternalEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<any>) {
    super(aggregateId);
  }
}

export class ClientDeletedExternalEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<any>) {
    super(aggregateId);
  }
}
