-- ====================================================================
-- contract_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "contract_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('DRAFT', 'Draft', '', '{}'::jsonb, 'system', TRUE, 'contractstatus'),
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'contractstatus'),
  ('SUSPENDED', 'Suspended', '', '{}'::jsonb, 'system', TRUE, 'contractstatus'),
  ('TERMINATED', 'Terminated', '', '{}'::jsonb, 'system', TRUE, 'contractstatus'),
  ('EXPIRED', 'Expired', '', '{}'::jsonb, 'system', TRUE, 'contractstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
