import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type CrmMilestoneRow = {
  id: string;
  name: string;
  status: string | null;
  contractId: string | null;
  invoiceId: string | null;
  paymentRuleType: string | null;
  paymentRuleValue: number | null;
  amount: number;
  currency: string | null;
  actualPaymentDueDate: string | null;
  clientAcceptanceDate: string | null;
  invoicedAt: string | null;
  modificationDate: string | null;
};

type CrmContractRow = {
  id: string;
  name: string;
  contractNumber: string | null;
  clientId: string | null;
  status: string | null;
  termsId: string | null;
  subscriptionPlanId: string | null;
  policyVersion: string | null;
  appliedIncentivesCount: number;
  paymentTermsDays: number | null;
  renewalPeriodDays: number | null;
  currency: string | null;
  autoRenew: boolean;
  startDate: string | null;
  endDate: string | null;
  providerId: string | null;
  signedAt: string | null;
  signedByClient: boolean;
  totalValue: number;
  modificationDate: string | null;
};

@Injectable()
export class CrmTacticalSummaryService {
  constructor(@Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined) {}

  async getSummary(limit: number = 6): Promise<Record<string, unknown>> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return this.emptyResponse();
    }

    const safeLimit = Math.max(1, Math.min(limit, 12));
    const [contractTotals] = await dataSource.query(
      `SELECT
         COUNT(*)::int AS "totalContracts",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'ACTIVE')::int AS "activeContracts",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'EXPIRED')::int AS "expiredContracts",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) IN ('ACTIVE','SIGNED','APPROVED'))::int AS "commerciallyReadyContracts",
         COUNT(*) FILTER (WHERE COALESCE(NULLIF("clientId"::text, ''), '') <> '')::int AS "contractsWithClientBinding",
         COUNT(*) FILTER (
           WHERE COALESCE(NULLIF("termsId"::text, ''), '') <> ''
             AND COALESCE(NULLIF("subscriptionPlanId"::text, ''), '') <> ''
         )::int AS "contractsWithVersionedPolicy",
         COUNT(*) FILTER (WHERE COALESCE("signedByClient", false) = true)::int AS "contractsSignedByClient",
         COUNT(*) FILTER (
           WHERE COALESCE(NULLIF("clientId"::text, ''), '') <> ''
             AND COALESCE(NULLIF("termsId"::text, ''), '') <> ''
             AND COALESCE(NULLIF("subscriptionPlanId"::text, ''), '') <> ''
             AND COALESCE("signedByClient", false) = true
         )::int AS "contractsReadyForLiquidation",
         COUNT(*) FILTER (
           WHERE COALESCE(NULLIF("termsId"::text, ''), '') = ''
              OR COALESCE(NULLIF("subscriptionPlanId"::text, ''), '') = ''
         )::int AS "contractsMissingCommercialPolicy"
       FROM contract_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'contract'`,
    );

    const [milestoneTotals] = await dataSource.query(
      `SELECT
         COUNT(*)::int AS "totalMilestones",
         COUNT(*) FILTER (WHERE COALESCE(NULLIF("invoiceId"::text, ''), '') <> '')::int AS "invoicedMilestones",
         COUNT(*) FILTER (WHERE COALESCE("clientAcceptanceDate", NULL) IS NOT NULL)::int AS "acceptedMilestones",
         COUNT(*) FILTER (WHERE COALESCE(NULLIF("paymentRuleType", ''), '') <> '')::int AS "milestonesWithPaymentRule",
         COUNT(*) FILTER (WHERE COALESCE("actualPaymentDueDate", NULL) IS NOT NULL AND "actualPaymentDueDate" < CURRENT_DATE AND COALESCE(NULLIF("invoiceId"::text, ''), '') = '')::int AS "overdueMilestones",
         COUNT(*) FILTER (WHERE COALESCE("clientAcceptanceDate", NULL) IS NOT NULL AND COALESCE(NULLIF("invoiceId"::text, ''), '') = '')::int AS "readyForInvoiceMilestones"
       FROM payment_milestone_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'paymentmilestone'`,
    );

    const [billingTotals] = await dataSource.query(
      `SELECT
         COUNT(*)::int AS "billingCyclesConfigured",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(code, '')) = 'MONTHLY')::int AS "monthlyCycles",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(code, '')) = 'QUARTERLY')::int AS "quarterlyCycles",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(code, '')) = 'YEARLY')::int AS "yearlyCycles"
       FROM billing_cycle_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'billingcycle'`,
    );

    const latestMilestones = await dataSource.query(
      `SELECT id, name, status, "contractId", "invoiceId", "paymentRuleType",
              COALESCE("paymentRuleValue", 0)::int AS "paymentRuleValue",
              COALESCE(amount, 0)::float AS amount,
              currency,
              "actualPaymentDueDate", "clientAcceptanceDate", "invoicedAt", "modificationDate"
       FROM payment_milestone_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'paymentmilestone'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const latestContracts = await dataSource.query(
            `SELECT id, name, "contractNumber", "clientId", status, "termsId", "subscriptionPlanId",
              COALESCE(NULLIF(metadata::jsonb ->> 'policyVersion', ''), CONCAT('contract-', COALESCE("contractNumber", id::text), '@', TO_CHAR(COALESCE("modificationDate", "creationDate"), 'YYYYMMDDHH24MISS'))) AS "policyVersion",
              COALESCE((SELECT COUNT(*)::int FROM jsonb_object_keys(COALESCE("appliedIncentives"::jsonb, '{}'::jsonb)) AS incentive_key), 0)::int AS "appliedIncentivesCount",
              COALESCE("paymentTermsDays", 0)::int AS "paymentTermsDays",
              COALESCE("renewalPeriodDays", 0)::int AS "renewalPeriodDays",
              currency,
              COALESCE("autoRenew", false) AS "autoRenew",
              "startDate", "endDate", "providerId", "signedAt",
              COALESCE("signedByClient", false) AS "signedByClient",
              COALESCE("totalValue", 0)::float AS "totalValue",
              "modificationDate"
       FROM contract_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'contract'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const billingCycles = await dataSource.query(
      `SELECT code, "displayName", "modificationDate"
       FROM billing_cycle_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'billingcycle'
       ORDER BY code ASC, COALESCE("modificationDate", "creationDate") DESC
       LIMIT 6`,
    );

    return {
      ok: true,
      message: 'Resumen táctico CRM obtenido con éxito.',
      data: {
        totals: {
          totalContracts: Number(contractTotals?.totalContracts ?? 0),
          activeContracts: Number(contractTotals?.activeContracts ?? 0),
          expiredContracts: Number(contractTotals?.expiredContracts ?? 0),
          commerciallyReadyContracts: Number(contractTotals?.commerciallyReadyContracts ?? 0),
          contractsWithClientBinding: Number(contractTotals?.contractsWithClientBinding ?? 0),
          contractsWithVersionedPolicy: Number(contractTotals?.contractsWithVersionedPolicy ?? 0),
          contractsSignedByClient: Number(contractTotals?.contractsSignedByClient ?? 0),
          contractsReadyForLiquidation: Number(contractTotals?.contractsReadyForLiquidation ?? 0),
          contractsMissingCommercialPolicy: Number(contractTotals?.contractsMissingCommercialPolicy ?? 0),
          totalMilestones: Number(milestoneTotals?.totalMilestones ?? 0),
          acceptedMilestones: Number(milestoneTotals?.acceptedMilestones ?? 0),
          milestonesWithPaymentRule: Number(milestoneTotals?.milestonesWithPaymentRule ?? 0),
          overdueMilestones: Number(milestoneTotals?.overdueMilestones ?? 0),
          readyForInvoiceMilestones: Number(milestoneTotals?.readyForInvoiceMilestones ?? 0),
          invoicedMilestones: Number(milestoneTotals?.invoicedMilestones ?? 0),
          billingCyclesConfigured: Number(billingTotals?.billingCyclesConfigured ?? 0),
          monthlyCycles: Number(billingTotals?.monthlyCycles ?? 0),
          quarterlyCycles: Number(billingTotals?.quarterlyCycles ?? 0),
          yearlyCycles: Number(billingTotals?.yearlyCycles ?? 0),
        },
        latestMilestones: latestMilestones as CrmMilestoneRow[],
        latestContracts: latestContracts as CrmContractRow[],
        billingCycles,
      },
      count: Array.isArray(latestMilestones) ? latestMilestones.length : 0,
    };
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }

  private emptyResponse(): Record<string, unknown> {
    return {
      ok: true,
      message: 'Resumen táctico CRM obtenido con éxito.',
      data: {
        totals: {
          totalContracts: 0,
          activeContracts: 0,
          expiredContracts: 0,
          commerciallyReadyContracts: 0,
          contractsWithClientBinding: 0,
          contractsWithVersionedPolicy: 0,
          contractsSignedByClient: 0,
          contractsReadyForLiquidation: 0,
          contractsMissingCommercialPolicy: 0,
          totalMilestones: 0,
          acceptedMilestones: 0,
          milestonesWithPaymentRule: 0,
          overdueMilestones: 0,
          readyForInvoiceMilestones: 0,
          invoicedMilestones: 0,
          billingCyclesConfigured: 0,
          monthlyCycles: 0,
          quarterlyCycles: 0,
          yearlyCycles: 0,
        },
        latestMilestones: [],
        latestContracts: [],
        billingCycles: [],
      },
      count: 0,
    };
  }
}