BEGIN;
-- DROP TABLE IF EXISTS lit CASCADE;
DROP TABLE IF EXISTS bikelanes CASCADE;

-- ALTER TABLE _lit_temp RENAME TO lit;
ALTER TABLE _bikelanes_temp RENAME TO bikelanes;
COMMIT;

--- Views are newly created in init_db.py because they are deleted via the DROP TABLE CASCADE
