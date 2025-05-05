DROP TABLE IF EXISTS parking_punching_areas;

SELECT
  ST_Buffer (geom, 5) as geom INTO parking_punching_areas
FROM
  parking_intersection_corners;

ALTER TABLE parking_punching_areas
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_punching_areas_geom_idx ON parking_intersections USING GIST (geom);

DO $$
BEGIN
  RAISE NOTICE 'Finished creating punching areas at %', clock_timestamp();
END
$$;
