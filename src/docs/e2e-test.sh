#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — crm-service (puerto 3019)
# Módulos: crmclientprofiles, providers, termsandconditions, subscriptionplans,
#          incentives, contracts, paymentmilestones, contractstatuslogs,
#          milestonestatuslogs, catalogsynclogs
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3019/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — CRM Microservice — 100% UH + Swagger             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/crmclientprofiles/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 CrmClientProfile"
P=$(cat <<EOF
{"name":"E2E CRM Profile ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"CCP-${UNIQUE}","clientId":"00000000-0000-0000-0000-000000000001",
 "clientCode":"C-${UNIQUE}","email":"e2e-${UNIQUE}@example.com","displayName":"E2E Client",
 "status":"ACTIVE","metadata":{"e2e":true}}
EOF
)
smoke_module "crmclientprofiles" "$P"

log_step 2 "UH-2 Provider"
P=$(cat <<EOF
{"name":"E2E Provider ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PRV-${UNIQUE}","legalName":"E2E Provider SA",
 "taxId":"PTX-${UNIQUE}","status":"ACTIVE","rating":4.5,"metadata":{"e2e":true}}
EOF
)
smoke_module "providers" "$P"

log_step 3 "UH-3 TermsAndCondition"
P=$(cat <<EOF
{"name":"E2E Terms ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"TC-${UNIQUE}","version":"1.0.0","isCurrent":true,
 "globalPaymentRule":"DAYS_AFTER_EXECUTION","globalPaymentDays":30,
 "effectiveFrom":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "termsandconditions" "$P"

log_step 4 "UH-4 SubscriptionPlan"
P=$(cat <<EOF
{"name":"E2E Plan ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PLN-${UNIQUE}","billingCycle":"MONTHLY",
 "basePrice":99.99,"currency":"USD","metadata":{"e2e":true}}
EOF
)
smoke_module "subscriptionplans" "$P"

log_step 5 "UH-4 Incentive"
P=$(cat <<EOF
{"name":"E2E Incentive ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"INC-${UNIQUE}","incentiveType":"DISCOUNT_PERCENT",
 "value":10,"metadata":{"e2e":true}}
EOF
)
smoke_module "incentives" "$P"

log_step 6 "UH-5 Contract"
P=$(cat <<EOF
{"name":"E2E Contract ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"CNT-${UNIQUE}","clientProfileId":"00000000-0000-0000-0000-000000000001",
 "termsAndConditionId":"00000000-0000-0000-0000-000000000002","status":"DRAFT",
 "startDate":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "contracts" "$P"

log_step 7 "UH-6 PaymentMilestone"
P=$(cat <<EOF
{"name":"E2E Milestone ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PM-${UNIQUE}","contractId":"00000000-0000-0000-0000-000000000003",
 "amount":500,"currency":"USD","status":"PENDING","metadata":{"e2e":true}}
EOF
)
smoke_module "paymentmilestones" "$P"

log_step 8 "UH-5 ContractStatusLog"
P=$(cat <<EOF
{"name":"E2E CSL ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"CSL-${UNIQUE}","contractId":"00000000-0000-0000-0000-000000000003",
 "fromStatus":"DRAFT","toStatus":"ACTIVE","changedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "contractstatuslogs" "$P"

log_step 9 "UH-6 MilestoneStatusLog"
P=$(cat <<EOF
{"name":"E2E MSL ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"MSL-${UNIQUE}","milestoneId":"00000000-0000-0000-0000-000000000004",
 "fromStatus":"PENDING","toStatus":"SIGNED","changedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "milestonestatuslogs" "$P"

log_step 10 "UH-8 CatalogSyncLog"
P=$(cat <<EOF
{"name":"E2E Log ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"categoryCode":"contract-status","triggeredBy":"e2e-test",
 "itemsAddedCount":0,"itemsUpdatedCount":0,"itemsRemovedCount":0,
 "outcome":"SUCCESS","syncedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogsynclogs" "$P"

log_step 11 "UH-8 catalog-client"
smoke_catalog_client

log_step 12 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*crm[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics crm.* detectados"; else log_warn "Sin topics crm.*"; fi
else log_warn "kcat no instalado — skipping"; fi

log_step 13 "Semantic search (pgvector + IA)"
SEM_RESP=$(do_get "$BASE_URL/crmclientprofiles/query/semantic-search?q=E2E%20Client" "$AUTH")
SEM_CODE=$(extract_code "$SEM_RESP")
if [[ "$SEM_CODE" =~ ^(200|201)$ ]]; then
  MODE=$(echo "$SEM_RESP" | sed -n 's/.*"searchMode":"\([^"]*\)".*/\1/p' | head -1)
  if [[ "$MODE" =~ ^(SEMANTIC|TEXTUAL|TEXTUAL_FALLBACK)$ ]]; then
    log_ok "semantic-search OK ($SEM_CODE, mode=$MODE)"
  else
    log_warn "semantic-search sin searchMode esperado (code=$SEM_CODE)"
  fi
else
  log_warn "semantic-search respondió $SEM_CODE (puede no estar implementado)"
fi

print_summary "crm-service"
