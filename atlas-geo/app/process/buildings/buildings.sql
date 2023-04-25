DROP TABLE IF EXISTS buildings;

-- cluster all intersecting buildings
SELECT (unnest(st_clusterintersecting(geom))) AS geom INTO buildings FROM _buildings_temp;

-- join clusters and convert to multi polygons
UPDATE buildings SET geom = st_multi(st_unaryunion(geom));

-- set CRS (couldn't find a way to infer the CRS)
ALTER TABLE buildings ALTER COLUMN geom TYPE geometry (MultiPolygon, 3857);

-- delete small buildings < 20qm
-- TODO: figure out why "20" does not work as a value; I picked the 100 by checking what looked reasonable for http://localhost:7800/public.buildings.html#15.18/52.441297/13.557327
DELETE FROM buildings WHERE ST_Area(geom) < 100;
