DROP TABLE IF EXISTS parking_obstacle_points_located;

-- Correct INTO placement
SELECT DISTINCT
  ON (nkm.node_id) nkm.idx,
  nkm.way_id,
  p.osm_id,
  p.osm_type,
  p.id,
  p.tags,
  p.meta,
  p.geom,
  p.minzoom INTO parking_obstacle_points_located
FROM
  parking_obstacle_points p
  JOIN _node_kerb_mapping nkm ON p.osm_id = nkm.node_id
WHERE
  p.tags ->> 'perform_snap' = 'side'
ORDER BY
  nkm.node_id,
  nkm.way_id DESC;

ALTER TABLE parking_obstacle_points_located
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

DO $$
BEGIN
  RAISE NOTICE 'Finished locating obstacle points on kerb';
END
$$;
