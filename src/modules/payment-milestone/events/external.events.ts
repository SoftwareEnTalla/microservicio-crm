/*
 * External cross-service event consumed from invoice-service via Kafka.
 * Topic: invoice.invoice-created.
 */

import { BaseEvent, PayloadEvent } from './base.event';

export class InvoiceCreatedExternalEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<any>) {
    super(aggregateId);
  }
}
