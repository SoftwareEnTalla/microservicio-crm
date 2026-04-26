# CRM Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3019
> **Base URL**: `http://localhost:3019/api`
> **Swagger UI**: `http://localhost:3019/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: CRM (Customer Relationship Management)

El microservicio **crm** concentra la gestión comercial: proveedores (providers), contratos,
incentivos (comisiones, bonos, penalizaciones) y hitos de pago asociados al ciclo de vida del
contrato. Aplica el patrón **Upstream-Mirror / Person-Role** (DSL v2.1) sobre `Provider`
(downstream mirror de `hrms.person`) y proyecta el perfil comercial del cliente (`crm-client-profile`).

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Alta/gestión de proveedores con Upstream-Mirror contra hrms.person | provider |
| UH-2 | Ciclo de vida de contratos | contract |
| UH-3 | Historial de estados del contrato | contract-status-log |
| UH-4 | Incentivos (bonos, comisiones, penalizaciones) | incentive |
| UH-5 | Hitos de pago del contrato | payment-milestone |
| UH-6 | Historial de estados de milestone | milestone-status-log |
| UH-7 | Perfil comercial del cliente (proyección) | crm-client-profile |
| UH-8 | Log de sincronización con catalog-service | catalog-sync-log |
| UH-9 | Proyección de nomencladores compartidos | catalog-client |
| UH-10 | Aggregate root `Crm` (raíz operativa del bounded context) | crm |

### UH-1: Upstream-Mirror en Provider

**Como** gestor CRM, **quiero** crear un `Provider` sin que exista todavía la persona en el
upstream (LOCAL_ONLY), **para** no bloquear el alta cuando el servicio upstream (`hrms.person`)
esté indisponible.

**Criterios de aceptación**:
- Estados `upstreamSyncStatus` con transiciones `LOCAL_ONLY → PENDING_UPSTREAM → SYNCED`.
- Endpoint `GET /api/providers/search-upstream-candidates` para anti-duplicación.
- Reconciler job empuja `LOCAL_ONLY` y refresca `SYNCED` stale cada N minutos.

---

## 2. Modelo DSL

| Modelo XML | Versión | Descripción |
|------------|---------|-------------|
| `models/crm/provider.xml` | 1.1.0 | Aggregate root Provider con `<upstream-mirror>` |
| `models/crm/contract.xml` | 1.0.0 | Contrato con estado |
| `models/crm/incentive.xml` | 1.0.0 | Incentivo |
| `models/crm/payment-milestone.xml` | 1.0.0 | Hito de pago |
| `models/crm/crm-client-profile.xml` | 1.0.0 | Proyección comercial del cliente |

### `<upstream-mirror>` en `provider.xml`

```xml
<upstream-mirror upstreamBoundedContext="hrms"
                 upstreamAggregate="person"
                 foreignKeyField="personId"
                 reconcileDirection="bidirectional"
                 reconcileStrategy="upstream-wins"
                 reconcileIntervalEnvVar="UPSTREAM_RECONCILE_INTERVAL_MINUTES"
                 reconcileIntervalDefaultMinutes="60">
  <mirror-field local="firstName" upstream="firstName" />
  <mirror-field local="lastName"  upstream="lastName" />
  <mirror-field local="email"     upstream="email" />
  <mirror-field local="phone"     upstream="phone" />
  <similarity-search fields="firstName,lastName,email,phone,document,taxId"
                     algorithm="pg_trgm+tsvector" maxResults="20" />
</upstream-mirror>
```

---

## 3. Arquitectura

Patrones estándar del ecosistema: **CQRS + Event Sourcing + Kafka + Hexagonal + DDD +
Saga Pattern**. Ver
[security-service/src/docs/README.md](../../../security-service/src/docs/README.md)
secciones 3.1–3.3 para diagrama de capas.

Artefactos auto-generados por el codegen para el patrón Upstream-Mirror (v2.1) en
`src/modules/provider/`:
- `services/provider-upstream-client.service.ts` — HTTP client + circuit breaker
- `sagas/provider-upstream-mirror.saga.ts` — `@Saga()` consume `hrms.person.*`
- `services/provider-upstream-reconciler.service.ts` — job `setInterval`
- `controllers/provider-upstream-search.controller.ts` — endpoint similarity

---

## 4. Módulos del Microservicio

### 4.1. Provider (aggregate root con upstream-mirror)
- **Entidad**: `Provider` — firstName, lastName, email, phone, document, taxId, personId (FK soft),
  upstreamSyncStatus, upstreamSyncedAt, upstreamHash, upstreamLastErrorAt, upstreamLastAttemptAt.

### 4.2. Contract
- **Entidad**: `Contract` — contractNumber, providerId, clientId, startDate, endDate, status.

### 4.3. ContractStatusLog
- Historial de transiciones de estado del contrato.

### 4.4. Incentive
- Bonos, comisiones, penalizaciones ligados a contratos/milestones.

### 4.5. PaymentMilestone
- Hitos de pago del contrato: fecha, monto, estado.

### 4.6. MilestoneStatusLog
- Historial de transiciones del milestone.

### 4.7. CrmClientProfile
- Proyección comercial del cliente: LTV, segmentación CRM, últimas interacciones.

### 4.8. CatalogSyncLog
- Log de sincronización con catalog-service.

### 4.9. CatalogClient
- Proyección local de nomencladores horizontales de catalog.

### 4.10. Crm (aggregate root operativo)
- Representa la raíz del bounded context CRM para operaciones agregadas.

---

## 5. Eventos Publicados

Cada módulo publica `<Module>CreatedEvent`, `<Module>UpdatedEvent`, `<Module>DeletedEvent` en
su topic Kafka correspondiente (`<kebab-name>-created|updated|deleted`).

| Módulo | Base | Tópicos Kafka |
|--------|------|---------------|
| provider | `Provider` | `provider-created`, `provider-updated`, `provider-deleted` |
| contract | `Contract` | `contract-created`, `contract-updated`, `contract-deleted` |
| contract-status-log | `ContractStatusLog` | `contract-status-log-*` |
| incentive | `Incentive` | `incentive-*` |
| payment-milestone | `PaymentMilestone` | `payment-milestone-*` |
| milestone-status-log | `MilestoneStatusLog` | `milestone-status-log-*` |
| crm-client-profile | `CrmClientProfile` | `crm-client-profile-*` |
| catalog-sync-log | `CatalogSyncLog` | `catalog-sync-log-*` |
| catalog-client | `CatalogClient` | `catalog-client-*` |
| crm | `Crm` | `crm-created`, `crm-updated`, `crm-deleted` |

Comando Kafka del patrón Upstream-Mirror:

| Topic | Propósito |
|-------|-----------|
| `register-person-from-provider-command` | Solicita al upstream (hrms) crear/ligar la persona correspondiente a un `Provider` LOCAL_ONLY |

---

## 6. Eventos Consumidos

| Módulo | Evento Consumido | Origen | Acción |
|--------|-----------------|--------|--------|
| provider (saga upstream-mirror) | `hrms.person.*` | hrms-service | Aplicar patch mirror local |
| catalog-client | Eventos de catalog | catalog-service | Sincronizar nomencladores |
| crm-client-profile (sync sagas) | Eventos de `client-service` | client-service | Proyectar datos comerciales |

---

## 7. API REST — Guía Completa Swagger

Patrones Command/Query CRUD estándar. Ver
[security-service/src/docs/README.md](../../../security-service/src/docs/README.md)
secciones 7.1–7.2.

### Prefijos de rutas

| Módulo | Command | Query |
|--------|---------|-------|
| provider | `/api/providers/command` | `/api/providers/query` |
| contract | `/api/contracts/command` | `/api/contracts/query` |
| incentive | `/api/incentives/command` | `/api/incentives/query` |
| payment-milestone | `/api/paymentmilestones/command` | `/api/paymentmilestones/query` |
| crm-client-profile | `/api/crmclientprofiles/command` | `/api/crmclientprofiles/query` |
| crm | `/api/crms/command` | `/api/crms/query` |
| ... | ... | ... |

### 7.3. Endpoint especial Upstream-Mirror

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/providers/search-upstream-candidates?q=&types=&limit=` | Bearer | Búsqueda por similitud contra `hrms.person` |

Responde 503 + `{ status: 'UPSTREAM_DOWN', candidates: [] }` cuando el circuit-breaker está OPEN.

### 7.5. Autenticación

- Stub `Authorization: Bearer valid-token`
- Swagger: `admin:admin123`

---

## 8. Guía para Desarrolladores

Ver [security-service/src/docs/README.md](../../../security-service/src/docs/README.md) sección 8
para creación de eventos, sagas y convenciones CQRS.

Específico del patrón Upstream-Mirror (v2.1):
- Reglas `R11` y `R12` en `/memories/codegen-rules.md`.
- Plantilla detallada en `/memories/repo/upstream-mirror-pattern.md`.

---

## 9. Test E2E con curl

```bash
cd crm-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash crm-service/src/docs/e2e-test.sh
```

### Requisitos previos

1. Crm-service corriendo en `http://localhost:3019`
2. PostgreSQL accesible (`crm-service` DB)
3. Opcional: hrms-service en `http://localhost:3017` (para upstream-mirror end-to-end)
4. `curl` y `jq` instalados

---

## 10. Análisis de Sagas y Eventos (E2E)

### Sagas CRUD

Un `<Module>CrudSaga` por aggregate (Provider, Contract, ContractStatusLog, Incentive,
PaymentMilestone, MilestoneStatusLog, CrmClientProfile, CatalogSyncLog, CatalogClient, Crm).
Cada saga expone 3 handlers (`Created`, `Updated`, `Deleted`).

### Sagas Upstream-Mirror (v2.1) — módulo provider

| Saga | Evento fuente | Acción |
|------|--------------|--------|
| `ProviderUpstreamMirrorSaga.onUpstreamEvent` | `hrms.person.*` | Patch mirror + SHA-256 + `SYNCED` |

### Job de reconciliación (provider)

`ProviderUpstreamReconcilerService`:
- **Flujo 1**: `LOCAL_ONLY`/`PENDING_UPSTREAM` → `PENDING_UPSTREAM` + publica
  `register-person-from-provider-command`.
- **Flujo 2**: `SYNCED` stale → `GET /persons/query/batch-by-ids` en hrms y refresca snapshot.
