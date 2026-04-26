-- ====================================================================
-- incentive_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "incentive_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('DISCOUNT_PERCENT', 'Discount Percent', '', '{}'::jsonb, 'system', TRUE, 'incentivetype'),
  ('DISCOUNT_FIXED', 'Discount Fixed', '', '{}'::jsonb, 'system', TRUE, 'incentivetype'),
  ('BONUS_POINTS', 'Bonus Points', '', '{}'::jsonb, 'system', TRUE, 'incentivetype'),
  ('COMMISSION', 'Commission', '', '{}'::jsonb, 'system', TRUE, 'incentivetype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
