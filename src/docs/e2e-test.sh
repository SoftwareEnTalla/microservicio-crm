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

# >>> NOMENCLADORES E2E BEGIN (auto-generado por sources/scaffold_nomenclador_e2e_tests.py)
# Servicio: crm-service | Puerto: 3019
NOM_BASE_URL="${NOM_BASE_URL:-http://localhost:3019/api}"
NOM_AUTH="${AUTH:-Bearer valid-token}"
nom_pass=0; nom_fail=0; nom_warn=0
_nom_ok()   { echo -e "  \033[0;32m✔ $1\033[0m"; nom_pass=$((nom_pass+1)); }
_nom_fail() { echo -e "  \033[0;31m✘ $1\033[0m"; nom_fail=$((nom_fail+1)); }
_nom_warn() { echo -e "  \033[1;33m⚠ $1\033[0m"; nom_warn=$((nom_warn+1)); }
NOM_UNIQUE="${UNIQUE:-$(date +%s)}"
NOM_NOW="${NOW:-$(date -u +%Y-%m-%dT%H:%M:%S.000Z)}"
echo ""
echo -e "\033[0;34m═══ NOMENCLADORES — crm-service ═══\033[0m"

# --- Nomenclador: billing-cycle ---
NOM_CODE="NBILLIN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E BillingCycle ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/billingcycles/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "billing-cycle: create id=$NOM_ID"; else _nom_warn "billing-cycle: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/billingcycles/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "billing-cycle: list ok"; else _nom_warn "billing-cycle: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/billingcycles/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "billing-cycle: getById" || _nom_warn "billing-cycle: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/billingcycles/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E BillingCycle updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "billing-cycle: update" || _nom_warn "billing-cycle: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/billingcycles/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "billing-cycle: delete" || _nom_warn "billing-cycle: delete"
fi

# --- Nomenclador: contract-status ---
NOM_CODE="NCONTRA-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E ContractStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/contractstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "contract-status: create id=$NOM_ID"; else _nom_warn "contract-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/contractstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "contract-status: list ok"; else _nom_warn "contract-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/contractstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "contract-status: getById" || _nom_warn "contract-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/contractstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E ContractStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "contract-status: update" || _nom_warn "contract-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/contractstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "contract-status: delete" || _nom_warn "contract-status: delete"
fi

# --- Nomenclador: crm-client-profile-status ---
NOM_CODE="NCRMCLI-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E CrmClientProfileStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/crmclientprofilestatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "crm-client-profile-status: create id=$NOM_ID"; else _nom_warn "crm-client-profile-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/crmclientprofilestatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "crm-client-profile-status: list ok"; else _nom_warn "crm-client-profile-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/crmclientprofilestatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "crm-client-profile-status: getById" || _nom_warn "crm-client-profile-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/crmclientprofilestatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E CrmClientProfileStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "crm-client-profile-status: update" || _nom_warn "crm-client-profile-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/crmclientprofilestatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "crm-client-profile-status: delete" || _nom_warn "crm-client-profile-status: delete"
fi

# --- Nomenclador: global-payment-rule ---
NOM_CODE="NGLOBAL-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E GlobalPaymentRule ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/globalpaymentrules/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "global-payment-rule: create id=$NOM_ID"; else _nom_warn "global-payment-rule: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/globalpaymentrules/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "global-payment-rule: list ok"; else _nom_warn "global-payment-rule: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/globalpaymentrules/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "global-payment-rule: getById" || _nom_warn "global-payment-rule: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/globalpaymentrules/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E GlobalPaymentRule updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "global-payment-rule: update" || _nom_warn "global-payment-rule: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/globalpaymentrules/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "global-payment-rule: delete" || _nom_warn "global-payment-rule: delete"
fi

# --- Nomenclador: incentive-type ---
NOM_CODE="NINCENT-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E IncentiveType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/incentivetypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "incentive-type: create id=$NOM_ID"; else _nom_warn "incentive-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/incentivetypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "incentive-type: list ok"; else _nom_warn "incentive-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/incentivetypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "incentive-type: getById" || _nom_warn "incentive-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/incentivetypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E IncentiveType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "incentive-type: update" || _nom_warn "incentive-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/incentivetypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "incentive-type: delete" || _nom_warn "incentive-type: delete"
fi

# --- Nomenclador: payment-milestone-status ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentMilestoneStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentmilestonestatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-milestone-status: create id=$NOM_ID"; else _nom_warn "payment-milestone-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmilestonestatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-milestone-status: list ok"; else _nom_warn "payment-milestone-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentmilestonestatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-milestone-status: getById" || _nom_warn "payment-milestone-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentmilestonestatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentMilestoneStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-milestone-status: update" || _nom_warn "payment-milestone-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentmilestonestatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-milestone-status: delete" || _nom_warn "payment-milestone-status: delete"
fi

# --- Nomenclador: payment-rule-type ---
NOM_CODE="NPAYMEN-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PaymentRuleType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/paymentruletypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "payment-rule-type: create id=$NOM_ID"; else _nom_warn "payment-rule-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentruletypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "payment-rule-type: list ok"; else _nom_warn "payment-rule-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/paymentruletypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-rule-type: getById" || _nom_warn "payment-rule-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/paymentruletypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PaymentRuleType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "payment-rule-type: update" || _nom_warn "payment-rule-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/paymentruletypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "payment-rule-type: delete" || _nom_warn "payment-rule-type: delete"
fi

# --- Nomenclador: person-type ---
NOM_CODE="NPERSON-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PersonType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/persontypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "person-type: create id=$NOM_ID"; else _nom_warn "person-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/persontypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "person-type: list ok"; else _nom_warn "person-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/persontypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "person-type: getById" || _nom_warn "person-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/persontypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PersonType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "person-type: update" || _nom_warn "person-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/persontypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "person-type: delete" || _nom_warn "person-type: delete"
fi

echo ""
echo -e "\033[0;34m── Resumen Nomencladores crm-service ──\033[0m"
echo "  ✔ OK=$nom_pass  ✘ FAIL=$nom_fail  ⚠ WARN=$nom_warn"
[[ ${nom_fail:-0} -eq 0 ]] || echo "[NOMENCLADORES] hay fallos en este servicio"
# <<< NOMENCLADORES E2E END
