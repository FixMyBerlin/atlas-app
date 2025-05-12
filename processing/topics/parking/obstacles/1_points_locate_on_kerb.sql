-- PREPARE
DROP TABLE IF EXISTS parking_obstacle_points_located;

-- Correct INTO placement
SELECT DISTINCT
  ON (nrm.node_id) nrm.idx,
  nrm.way_id,
  p.osm_id,
  p.osm_type,
  p.id,
  p.tags,
  p.meta,
  p.geom,
  p.minzoom INTO parking_obstacle_points_located
FROM
  parking_obstacle_points p
  JOIN _parking_node_road_mapping nrm ON p.osm_id = nrm.node_id
WHERE
  p.tags ->> 'perform_snap' = 'side'
ORDER BY
  nrm.node_id,
  nrm.way_id DESC;

ALTER TABLE parking_obstacle_points_located
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

DO $$
BEGIN
  RAISE NOTICE 'Finished locating obstacle points on kerb at %', clock_timestamp();
END
$$;
