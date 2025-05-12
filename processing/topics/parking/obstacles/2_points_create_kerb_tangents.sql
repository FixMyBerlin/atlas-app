DROP TABLE IF EXISTS parking_kerb_tangents;

SELECT DISTINCT
  osm_id,
  tags,
  kerb_tangent (way_id, idx, tags ->> 'side', 1, 1) as geom
  --
  INTO parking_kerb_tangents
FROM
  parking_obstacle_points_located;

ALTER TABLE parking_kerb_tangents
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

DO $$
BEGIN
  RAISE NOTICE 'Finished creating kerb tangents %', clock_timestamp();
END
$$;
