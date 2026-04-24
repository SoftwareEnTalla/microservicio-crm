/*
 * Cross-service saga: reacciona a invoice.invoice-created y marca el payment-milestone como facturado.
 */

import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import { InvoiceCreatedExternalEvent } from '../events/external.events';
import { UpdatePaymentMilestoneCommand } from '../commands/exporting.command';

@Injectable()
export class PaymentMilestoneCrossServiceSaga {
  private readonly logger = new Logger(PaymentMilestoneCrossServiceSaga.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Saga()
  onExternalInvoiceCreated = ($events: Observable<InvoiceCreatedExternalEvent>) => {
    return $events.pipe(
      ofType(InvoiceCreatedExternalEvent),
      tap((event) => {
        this.logger.log(`Cross-service: InvoiceCreated -> MarkMilestoneInvoiced (${event.aggregateId})`);
        void this.commandBus.execute(new UpdatePaymentMilestoneCommand(event.payload, event.payload));
      }),
      map(() => null),
    );
  };
}
