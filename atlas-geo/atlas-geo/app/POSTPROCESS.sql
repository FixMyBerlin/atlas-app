BEGIN;
DROP TABLE lit CASCADE;
DROP TABLE bikelanes CASCADE;
DROP TABLE "roadClassification" CASCADE;

ALTER TABLE lit_new RENAME TO lit;
ALTER TABLE bikelanes_new RENAME TO bikelanes;
ALTER TABLE "roadClassification_new" RENAME TO "roadClassification";
COMMIT;

--- Views are newly created in init_db.py because they are deleted via the DROP TABLE CASCADE
