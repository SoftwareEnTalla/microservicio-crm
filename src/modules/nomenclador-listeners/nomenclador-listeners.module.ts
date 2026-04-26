/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 *
 * NomencladorListenersModule — registra los listeners on<Nomenclador>Change
 * para todos los nomencladores referenciados por las entidades de este
 * microservicio. Se importa una sola vez desde app.module.ts.
 *
 * Generado por sources/scaffold_nomenclador_listeners.py — NO editar a mano.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { OnActiveStatusChangeListener } from './on-active-status-change.listener';
import { OnBillingCycleChangeListener } from './on-billing-cycle-change.listener';
import { OnContractStatusChangeListener } from './on-contract-status-change.listener';
import { OnCrmClientProfileStatusChangeListener } from './on-crm-client-profile-status-change.listener';
import { OnDocumentTypeChangeListener } from './on-document-type-change.listener';
import { OnGlobalPaymentRuleChangeListener } from './on-global-payment-rule-change.listener';
import { OnIncentiveTypeChangeListener } from './on-incentive-type-change.listener';
import { OnPaymentMilestoneStatusChangeListener } from './on-payment-milestone-status-change.listener';
import { OnPaymentRuleTypeChangeListener } from './on-payment-rule-type-change.listener';
import { OnPersonTypeChangeListener } from './on-person-type-change.listener';
import { OnUpstreamSyncStatusChangeListener } from './on-upstream-sync-status-change.listener';

@Module({
  imports: [ConfigModule, CqrsModule],
  providers: [
    OnActiveStatusChangeListener,
    OnBillingCycleChangeListener,
    OnContractStatusChangeListener,
    OnCrmClientProfileStatusChangeListener,
    OnDocumentTypeChangeListener,
    OnGlobalPaymentRuleChangeListener,
    OnIncentiveTypeChangeListener,
    OnPaymentMilestoneStatusChangeListener,
    OnPaymentRuleTypeChangeListener,
    OnPersonTypeChangeListener,
    OnUpstreamSyncStatusChangeListener,
  ],
  exports: [
    OnActiveStatusChangeListener,
    OnBillingCycleChangeListener,
    OnContractStatusChangeListener,
    OnCrmClientProfileStatusChangeListener,
    OnDocumentTypeChangeListener,
    OnGlobalPaymentRuleChangeListener,
    OnIncentiveTypeChangeListener,
    OnPaymentMilestoneStatusChangeListener,
    OnPaymentRuleTypeChangeListener,
    OnPersonTypeChangeListener,
    OnUpstreamSyncStatusChangeListener,
  ],
})
export class NomencladorListenersModule {}
