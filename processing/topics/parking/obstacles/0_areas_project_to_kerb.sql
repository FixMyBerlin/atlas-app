DROP TABLE IF EXISTS parking_obstacle_areas_projected CASCADE;

SELECT
  osm_type,
  osm_id,
  id,
  tags,
  meta,
  minzoom,
  -- @var "2": Max distance (radius) (Meter) for snapping
  -- @var "6": Max number of kerbs that gets snapped to
  project_to_k_closest_kerbs (geom, 2, 6) as geom
  --
  INTO parking_obstacle_areas_projected
FROM
  parking_obstacle_areas;

DELETE FROM parking_obstacle_areas_projected
WHERE
  geom IS NULL;

ALTER TABLE parking_obstacle_areas_projected
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX idx_parking_obstacle_areas_projected_geom ON parking_obstacle_areas_projected USING gist (geom);

DO $$
BEGIN
  RAISE NOTICE 'Finished projecting obstacle areas at %', clock_timestamp();
END
$$;
