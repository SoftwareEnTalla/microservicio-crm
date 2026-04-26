-- ====================================================================
-- billing_cycle_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "billing_cycle_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('MONTHLY', 'Monthly', '', '{}'::jsonb, 'system', TRUE, 'billingcycle'),
  ('QUARTERLY', 'Quarterly', '', '{}'::jsonb, 'system', TRUE, 'billingcycle'),
  ('YEARLY', 'Yearly', '', '{}'::jsonb, 'system', TRUE, 'billingcycle')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
