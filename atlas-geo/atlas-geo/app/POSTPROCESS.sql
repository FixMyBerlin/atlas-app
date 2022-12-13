BEGIN;
DROP TABLE IF EXISTS lit CASCADE;
DROP TABLE IF EXISTS bikelanes CASCADE;

ALTER TABLE lit_new RENAME TO lit;
ALTER TABLE bikelanes_new RENAME TO bikelanes;
COMMIT;

--- Views are newly created in init_db.py because they are deleted via the DROP TABLE CASCADE
