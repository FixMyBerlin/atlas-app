-- create a new schema geo for storing the osm2pgsql output
CREATE SCHEMA geo;

CREATE SCHEMA postgis;

ALTER DATABASE postgres SET search_path = "$user",public,topology,tiger,postgis;

-- Temporarily made postis relocatable
UPDATE pg_extension SET extrelocatable = true WHERE extname = 'postgis';

-- Relocate it
ALTER EXTENSION postgis SET SCHEMA postgis;