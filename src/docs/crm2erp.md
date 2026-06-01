# crm2erp.md

# CRM → ERP Enterprise Commercial Architecture

## Purpose

This document provides complete domain context for designing, developing, integrating, and scaling CRM and ERP commercial systems.

It is specifically optimized for:
- AI coding assistants
- Copilot
- ChatGPT
- Claude
- Cursor
- LLM-driven development environments

The objective is to provide enough semantic, architectural, operational, and technical context so an AI can:
- Understand the commercial domain
- Generate coherent backend/frontend code
- Design APIs
- Create database schemas
- Implement workflows
- Model business rules
- Generate integrations
- Build scalable enterprise systems

---

# 1. High-Level Business Vision

## CRM Definition

CRM (Customer Relationship Management) manages customer interactions and commercial workflows.

CRM responsibilities:
- Lead management
- Prospecting
- Sales pipeline
- Opportunity tracking
- Customer communication
- Sales automation
- Marketing automation
- Customer success
- Post-sales support

CRM is customer-centric and revenue-oriented.

CRM focus:
- Relationship management
- Commercial efficiency
- Sales optimization
- Customer lifecycle

CRM operates mainly in:

```text
Front Office
```

---

## ERP Definition

ERP (Enterprise Resource Planning) manages operational and financial business processes.

ERP responsibilities:
- Sales orders
- Inventory
- Warehousing
- Procurement
- Accounting
- Billing
- Logistics
- Manufacturing
- Finance
- Payments
- Reporting

ERP is operations-centric and transaction-oriented.

ERP focus:
- Operational control
- Financial integrity
- Process standardization
- Resource planning

ERP operates mainly in:

```text
Back Office
```

---

# 2. Complete Commercial Lifecycle

```text
Marketing Campaign
    ↓
Lead Generation
    ↓
Lead Qualification
    ↓
Opportunity Creation
    ↓
Sales Activities
    ↓
Quotation
    ↓
Negotiation
    ↓
Deal Won
    ↓
Sales Order
    ↓
Inventory Allocation
    ↓
Invoice Generation
    ↓
Payment Collection
    ↓
Shipping
    ↓
Delivery
    ↓
Post-Sales Support
    ↓
Customer Retention
```

---

# 3. CRM vs ERP Responsibilities

| Domain | CRM | ERP |
|---|---|---|
| Leads | YES | NO |
| Opportunities | YES | NO |
| Sales Pipeline | YES | NO |
| Sales Activities | YES | NO |
| Marketing Automation | YES | NO |
| Customer Communication | YES | NO |
| Quotes | YES | PARTIAL |
| Sales Orders | NO | YES |
| Inventory | NO | YES |
| Procurement | NO | YES |
| Accounting | NO | YES |
| Billing | NO | YES |
| Payments | NO | YES |
| Logistics | NO | YES |
| Financial Reporting | NO | YES |

---

# 4. Core Domain Entities

# CRM Entities

## Lead

A potential customer not yet qualified.

### Business Characteristics
- Early-stage contact
- Usually from marketing
- Requires qualification
- May become opportunity

### JSON Model

```json
{
  "id": "uuid",
  "source": "website",
  "status": "new",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@company.com",
  "phone": "+1-555-5555",
  "company": "ACME Inc",
  "assigned_to": "sales_rep_uuid",
  "created_at": "timestamp"
}
```

### Lead Sources
- Website forms
- Paid ads
- Events
- Cold outreach
- Referrals
- LinkedIn
- Social media
- Webinars

---

## Account

Represents a company or organization.

### Business Characteristics
- Commercial entity
- May have multiple contacts
- Has financial conditions
- Shared across CRM and ERP

### JSON Model

```json
{
  "id": "uuid",
  "legal_name": "ACME Corporation",
  "tax_id": "RFC/CUIT/EIN",
  "industry": "manufacturing",
  "website": "https://acme.com",
  "billing_address": {},
  "shipping_address": {},
  "credit_limit": 50000,
  "payment_terms": "NET30",
  "status": "active"
}
```

---

## Contact

Represents an individual person within an account.

### JSON Model

```json
{
  "id": "uuid",
  "account_id": "uuid",
  "full_name": "Jane Doe",
  "position": "Procurement Director",
  "email": "jane@acme.com",
  "phone": "+1-555-0000"
}
```

---

## Opportunity

Represents a potential sale.

### Business Characteristics
- Exists after qualification
- Belongs to pipeline
- Has estimated revenue
- Has probability of closing

### JSON Model

```json
{
  "id": "uuid",
  "account_id": "uuid",
  "title": "Industrial Equipment Upgrade",
  "stage": "proposal",
  "estimated_value": 120000,
  "probability": 70,
  "expected_close_date": "2026-06-01",
  "owner_id": "sales_rep_uuid"
}
```

---

## Activity

Represents a commercial interaction.

### Types
- Call
- Meeting
- Email
- Demo
- Follow-up
- Site visit

### JSON Model

```json
{
  "id": "uuid",
  "opportunity_id": "uuid",
  "type": "meeting",
  "scheduled_at": "timestamp",
  "notes": "Customer interested in premium package"
}
```

---

## Quote

Commercial proposal.

### Business Characteristics
- Contains products/services
- Has pricing rules
- Has taxes
- Has expiration date

### JSON Model

```json
{
  "id": "uuid",
  "opportunity_id": "uuid",
  "status": "sent",
  "currency": "USD",
  "subtotal": 10000,
  "taxes": 1600,
  "discount": 500,
  "total": 11100,
  "valid_until": "2026-06-15"
}
```

---

# ERP Entities

## Product

Commercial or operational item.

### JSON Model

```json
{
  "id": "uuid",
  "sku": "PRD-001",
  "name": "Industrial Pump",
  "description": "Heavy duty pump",
  "price": 2500,
  "currency": "USD",
  "stock_managed": true,
  "tax_code": "VAT_16"
}
```

---

## Warehouse

Storage location.

### JSON Model

```json
{
  "id": "uuid",
  "name": "Main Warehouse",
  "location": "Texas",
  "active": true
}
```

---

## Inventory

Tracks product stock.

### JSON Model

```json
{
  "product_id": "uuid",
  "warehouse_id": "uuid",
  "available_quantity": 150,
  "reserved_quantity": 25
}
```

---

## Sales Order

Formal order after deal closure.

### Business Characteristics
- Official operational transaction
- Generates inventory reservation
- Generates invoice

### JSON Model

```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "status": "confirmed",
  "currency": "USD",
  "total_amount": 15000,
  "warehouse_id": "uuid"
}
```

---

## Invoice

Fiscal document.

### JSON Model

```json
{
  "id": "uuid",
  "sales_order_id": "uuid",
  "invoice_number": "INV-2026-0001",
  "status": "paid",
  "subtotal": 10000,
  "taxes": 1600,
  "total": 11600,
  "due_date": "2026-07-01"
}
```

---

## Payment

Represents money collection.

### JSON Model

```json
{
  "id": "uuid",
  "invoice_id": "uuid",
  "amount": 11600,
  "method": "wire_transfer",
  "status": "completed"
}
```

---

# 5. Commercial Pipeline

## Standard B2B Pipeline

```text
NEW
↓
CONTACTED
↓
QUALIFIED
↓
MEETING
↓
PROPOSAL
↓
NEGOTIATION
↓
WON
```

---

## Pipeline Stage Definitions

### NEW
Lead was recently created.

### CONTACTED
Initial communication established.

### QUALIFIED
Customer has:
- Need
- Budget
- Decision authority

### MEETING
Discovery or presentation phase.

### PROPOSAL
Formal quote delivered.

### NEGOTIATION
Commercial adjustments and contract discussion.

### WON
Deal successfully closed.

### LOST
Deal failed or abandoned.

---

# 6. CRM → ERP Integration

## Integration Trigger

The most common trigger:

```text
Opportunity Status = WON
```

This creates:

```text
Sales Order
```

inside ERP.

---

# 7. CRM → ERP Data Synchronization

## CRM → ERP

| Entity | Operation |
|---|---|
| Customer | Sync |
| Contact | Sync |
| Quote | Sync |
| Opportunity | Reference |
| Sales Order | Create |

---

## ERP → CRM

| Entity | Operation |
|---|---|
| Invoice | Sync |
| Payment Status | Sync |
| Shipment Status | Sync |
| Customer Balance | Sync |

---

# 8. Recommended System Architecture

## High-Level Architecture

```text
Frontend Applications
        ↓
API Gateway
        ↓
CRM Services
        ↓
Message Broker / Event Bus
        ↓
ERP Services
        ↓
Databases
```

---

# 9. Integration Patterns

# REST API Pattern

## CRM Endpoints

```http
POST /api/leads
POST /api/opportunities
POST /api/quotes
GET  /api/accounts
```

---

## ERP Endpoints

```http
POST /api/sales-orders
POST /api/invoices
GET  /api/inventory
POST /api/payments
```

---

# Event-Driven Pattern

Recommended for scalable enterprise systems.

## Domain Events

```text
lead.created
lead.assigned
opportunity.created
opportunity.updated
quote.sent
quote.accepted
deal.won
sales_order.created
invoice.generated
payment.received
shipment.delivered
```

---

## Event Payload Example

```json
{
  "event": "deal.won",
  "timestamp": "2026-05-26T10:00:00Z",
  "payload": {
    "opportunity_id": "uuid",
    "customer_id": "uuid",
    "amount": 15000
  }
}
```

---

# 10. Automation Workflows

## Lead Assignment

```text
IF country = USA
THEN assign_to = north_america_team
```

---

## Follow-Up Automation

```text
IF no_response_in_5_days
THEN send_followup_email
```

---

## Quote Expiration

```text
IF quote_expired = true
THEN notify_sales_rep
```

---

## ERP Order Generation

```text
IF opportunity_status = WON
THEN create_sales_order
```

---

# 11. ERP Operational Flow

```text
Sales Order
    ↓
Stock Validation
    ↓
Inventory Reservation
    ↓
Picking
    ↓
Packing
    ↓
Shipping
    ↓
Delivery
```

---

# 12. Financial Flow

```text
Sales Order
    ↓
Invoice
    ↓
Accounts Receivable
    ↓
Payment
    ↓
Accounting Entry
```

---

# 13. CRM Database Schema

## Core Tables

```text
leads
accounts
contacts
opportunities
activities
quotes
quote_items
tasks
notes
attachments
```

---

# 14. ERP Database Schema

## Core Tables

```text
customers
products
warehouses
inventory
sales_orders
sales_order_items
invoices
invoice_items
payments
journal_entries
```

---

# 15. Security Model

## Authentication
- OAuth2
- JWT
- OpenID Connect

---

## Authorization
- RBAC
- Role-based permissions
- Fine-grained access control

---

## Auditability

Important for ERP systems.

Track:
- User actions
- Field changes
- Financial modifications
- Inventory changes

---

# 16. Scalability Architecture

## Recommended Stack

### Backend
- Node.js
- Java Spring Boot
- .NET
- Go

### Databases
- PostgreSQL
- MySQL
- SQL Server

### Cache
- Redis

### Messaging
- Kafka
- RabbitMQ
- NATS

### Containers
- Docker
- Kubernetes

---

# 17. SaaS Multi-Tenant Architecture

## Tenant Isolation

Every major table should contain:

```text
tenant_id
```

Example:

```json
{
  "tenant_id": "company_001"
}
```

---

# 18. AI-Aware Architecture

## CRM AI Use Cases

- Lead scoring
- Churn prediction
- Email generation
- Forecast prediction
- Opportunity risk analysis

---

## ERP AI Use Cases

- Inventory optimization
- Demand forecasting
- Fraud detection
- Payment prediction
- Supply chain optimization

---

# 19. Important Domain Rules

## CRM Rules

### Rule 1
Leads cannot generate invoices.

### Rule 2
Only WON opportunities create sales orders.

### Rule 3
Quotes expire.

### Rule 4
Pipeline stages must be ordered.

---

## ERP Rules

### Rule 1
Invoices require sales orders.

### Rule 2
Inventory cannot go negative.

### Rule 3
Payments affect accounting.

### Rule 4
Financial records are immutable after posting.

---

# 20. Common Enterprise Anti-Patterns

## Bad Practice

### Using ERP as CRM
ERP should not manage advanced sales workflows.

---

### Using CRM for Accounting
Accounting belongs exclusively to ERP.

---

### Full Bidirectional Sync
Dangerous and conflict-prone.

Prefer:

```text
Master Ownership Strategy
```

---

### Duplicate Customers
Requires:

```text
Master Data Management
```

---

# 21. Recommended Architectural Principles

## CRM Principles

- UX-first
- Workflow-driven
- Flexible
- Fast iteration
- High automation

---

## ERP Principles

- Strong consistency
- Auditability
- Financial integrity
- Transaction safety
- Deterministic behavior

---

# 22. Suggested Folder Structure

## CRM Backend

```text
crm/
├── modules/
│   ├── leads/
│   ├── accounts/
│   ├── opportunities/
│   ├── quotes/
│   └── activities/
├── events/
├── workflows/
├── integrations/
└── shared/
```

---

## ERP Backend

```text
erp/
├── modules/
│   ├── inventory/
│   ├── orders/
│   ├── invoices/
│   ├── payments/
│   └── accounting/
├── events/
├── integrations/
└── shared/
```

---

# 23. Recommended Event Naming Convention

```text
entity.action
```

Examples:

```text
lead.created
opportunity.updated
quote.sent
invoice.generated
payment.completed
```

---

# 24. Recommended API Naming Convention

## REST Style

```http
GET    /api/opportunities
POST   /api/opportunities
PATCH  /api/opportunities/:id
DELETE /api/opportunities/:id
```

---

# 25. AI Coding Assistant Context Rules

AI assistants should assume:

## CRM Characteristics

- Human interaction heavy
- Flexible workflows
- State-based systems
- Communication-centric
- High UX importance

---

## ERP Characteristics

- Transaction-heavy
- Financially sensitive
- Inventory-sensitive
- Strong consistency required
- Strict auditability required

---

# 26. Final Architecture Recommendation

## Recommended Enterprise Architecture

```text
Frontend Apps
    ↓
BFF Layer
    ↓
API Gateway
    ↓
CRM Microservices
    ↓
Event Bus
    ↓
ERP Microservices
    ↓
Database Cluster
```

---

# 27. Final Business Summary

CRM manages:
- Relationships
- Sales
- Communication
- Revenue generation

ERP manages:
- Operations
- Inventory
- Finance
- Accounting
- Logistics

CRM optimizes:

```text
Revenue Generation
```

ERP optimizes:

```text
Operational Execution
```

Together they create:

```text
End-to-End Commercial Infrastructure
```