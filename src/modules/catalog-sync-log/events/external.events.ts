/*
 * External cross-service events consumed from catalog-service via Kafka.
 * Topics: catalog.catalog-item-upserted / catalog.catalog-item-deprecated.
 */

import { BaseEvent, PayloadEvent } from './base.event';

export class CatalogItemUpsertedExternalEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<any>) {
    super(aggregateId);
  }
}

export class CatalogItemDeprecatedExternalEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<any>) {
    super(aggregateId);
  }
}
