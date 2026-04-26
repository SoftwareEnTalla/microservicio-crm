-- ====================================================================
-- global_payment_rule_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "global_payment_rule_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('NONE', 'None', '', '{}'::jsonb, 'system', TRUE, 'globalpaymentrule'),
  ('DAYS_AFTER_ACCEPTANCE', 'Days After Acceptance', '', '{}'::jsonb, 'system', TRUE, 'globalpaymentrule'),
  ('DAYS_AFTER_EXECUTION', 'Days After Execution', '', '{}'::jsonb, 'system', TRUE, 'globalpaymentrule')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
