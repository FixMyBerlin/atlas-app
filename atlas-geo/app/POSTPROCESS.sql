BEGIN;
DROP TABLE IF EXISTS geo.bikelanes CASCADE;

ALTER TABLE geo._bikelanes_temp RENAME TO bikelanes;
COMMIT;

--- Views are newly created in init_db.py because they are deleted via the DROP TABLE CASCADE
