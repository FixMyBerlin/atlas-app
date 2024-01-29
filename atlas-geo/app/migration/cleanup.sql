-- Learn more about this file in ./README.md
-- (!) Cleanup the file only AFTER the cleanup was done on production
-- DROP TABLE IF EXISTS "metadata";
--
--
-- Required for local dev
-- Those are recreated whenever we recreate the local docker setup
DROP SCHEMA IF EXISTS "tiger" CASCADE;

DROP SCHEMA IF EXISTS "tiger_data" CASCADE;
