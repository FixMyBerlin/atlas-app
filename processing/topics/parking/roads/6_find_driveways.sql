-- PREPARE
DROP TABLE IF EXISTS parking_driveways;

-- CREATE driveway table based on roads with `perform_driveway_punch=true`
SELECT
  r.*,
  nrm.idx INTO parking_driveways
FROM
  _parking_roads r
  JOIN _parking_node_road_mapping nrm ON r.osm_id = nrm.way_id
  JOIN parking_intersections i ON nrm.node_id = i.node_id
WHERE
  i.service_degree > 0
  AND i.degree <> i.service_degree
  AND r.is_service;

-- SHORTEN the driveway
-- @var: "10" specifies the new line to be 10 meters long
-- (Actually, this creates a new line starting from the road in the direction of the previous line.)
UPDATE parking_driveways
SET
  geom = ST_MakeLine (
    ST_PointN (geom, idx),
    ST_Project (
      ST_PointN (geom, idx),
      10,
      ST_Azimuth (
        ST_PointN (geom, idx),
        COALESCE(
          ST_PointN (geom, idx + 1),
          ST_PointN (geom, idx - 1)
        )
      )
    )
  );

-- MISC
ALTER TABLE parking_driveways
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

DO $$
BEGIN
  RAISE NOTICE 'Finished finding driveways at %', clock_timestamp();
END
$$;
