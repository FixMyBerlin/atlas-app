-- PREPARE
DROP TABLE IF EXISTS parking_intersection_corners;

-- for each road intersection where the roads incide with an angle smaller than 140 degrees
-- find the intersection points of the kerbs
SELECT
  i.node_id as intersection_id,
  i.degree,
  corners as geom INTO parking_intersection_corners
FROM
  parking_intersections as i
  CROSS JOIN LATERAL find_intersection_corners (i.node_id, 140) AS corners
WHERE
  i.driveway_degree = 0;

-- CLEANUP
ALTER TABLE parking_intersection_corners
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

DO $$
BEGIN
  RAISE NOTICE 'Finished calculating intersection corners at %', clock_timestamp();
END
$$;
