-- ====================================================================
-- payment_rule_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "payment_rule_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('FIXED_DATE', 'Fixed Date', '', '{}'::jsonb, 'system', TRUE, 'paymentruletype'),
  ('DAYS_AFTER_ACCEPTANCE', 'Days After Acceptance', '', '{}'::jsonb, 'system', TRUE, 'paymentruletype'),
  ('DAYS_AFTER_EXECUTION', 'Days After Execution', '', '{}'::jsonb, 'system', TRUE, 'paymentruletype'),
  ('CUSTOM_LOGIC', 'Custom Logic', '', '{}'::jsonb, 'system', TRUE, 'paymentruletype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
