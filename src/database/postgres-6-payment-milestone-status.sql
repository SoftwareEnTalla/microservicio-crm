-- ====================================================================
-- payment_milestone_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "payment_milestone_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('PENDING', 'Pending', '', '{}'::jsonb, 'system', TRUE, 'paymentmilestonestatus'),
  ('SIGNED', 'Signed', '', '{}'::jsonb, 'system', TRUE, 'paymentmilestonestatus'),
  ('EXECUTION', 'Execution', '', '{}'::jsonb, 'system', TRUE, 'paymentmilestonestatus'),
  ('EXECUTED', 'Executed', '', '{}'::jsonb, 'system', TRUE, 'paymentmilestonestatus'),
  ('REJECTED', 'Rejected', '', '{}'::jsonb, 'system', TRUE, 'paymentmilestonestatus'),
  ('ACCEPTED', 'Accepted', '', '{}'::jsonb, 'system', TRUE, 'paymentmilestonestatus'),
  ('INVOICED', 'Invoiced', '', '{}'::jsonb, 'system', TRUE, 'paymentmilestonestatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
