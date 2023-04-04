DROP TABLE buildings;
SELECT (unnest(st_clusterintersecting(geom))) AS geom INTO buildings FROM _buildings_temp;
UPDATE buildings SET geom = st_multi(st_unaryunion(geom));
ALTER TABLE buildings ALTER COLUMN geom TYPE geometry (MultiPolygon, 3857);
