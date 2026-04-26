-- ====================================================================
-- crm_client_profile_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "crm_client_profile_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'crmclientprofilestatus'),
  ('AT_RISK', 'At Risk', '', '{}'::jsonb, 'system', TRUE, 'crmclientprofilestatus'),
  ('ARCHIVED', 'Archived', '', '{}'::jsonb, 'system', TRUE, 'crmclientprofilestatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
