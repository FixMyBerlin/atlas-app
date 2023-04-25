DROP TABLE IF EXISTS buildings;

-- cluster all intersecting buildings
SELECT (unnest(st_clusterintersecting(geom))) AS geom INTO buildings FROM _buildings_temp;

-- join clusters and convert to multi polygons
UPDATE buildings SET geom = st_multi(st_unaryunion(geom));

-- copy results into final table and set CRS (couldn't find a way to infer the CRS)
ALTER TABLE buildings ALTER COLUMN geom TYPE geometry (MultiPolygon, 3857);

-- delete small buildings
DELETE FROM buildings WHERE ST_Area(geom) < 20;
