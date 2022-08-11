ALTER TABLE boundaries ADD COLUMN IF NOT EXISTS geog geography(MultiPolygon, 4326);
UPDATE boundaries SET geog = ST_Multi(geom)::geography;
ALTER TABLE boundaries ALTER COLUMN geom TYPE geometry(MultiPolygon, 25833) USING ST_Multi(ST_Transform(geom, 25833));

DROP INDEX IF EXISTS boundaries_geom_idx;
CREATE INDEX boundaries_geom_idx ON public.boundaries USING gist (geom);

DROP INDEX IF EXISTS boundaries_geog_idx;
CREATE INDEX boundaries_geog_idx ON public.boundaries USING gist (geog);
