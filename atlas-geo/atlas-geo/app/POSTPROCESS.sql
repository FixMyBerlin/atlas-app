BEGIN;
DROP TABLE IF EXISTS lit CASCADE;
DROP TABLE IF EXISTS bikelanes CASCADE;
DROP TABLE IF EXISTS "roadClassification" CASCADE;

ALTER TABLE lit_new RENAME TO lit;
ALTER TABLE bikelanes_new RENAME TO bikelanes;
ALTER TABLE "roadClassification_new" RENAME TO "roadClassification";
COMMIT;

--- Views are newly created in init_db.py because they are deleted via the DROP TABLE CASCADE
