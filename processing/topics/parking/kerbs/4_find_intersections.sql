DROP TABLE IF EXISTS parking_intersections;

WITH intersections AS (
  SELECT
    node_id,
    COUNT(way_id) AS way_count,
    MIN(way_id) AS way_id
  FROM "_node_kerb_mapping"
  GROUP BY node_id
  HAVING COUNT(way_id) > 2 OR (COUNT(way_id) = 2 AND NOT bool_and(is_terminal_node))
)
SELECT
  i.node_id,
  i.way_id,
  i.way_count,
  ST_PointN(kerb.geom, nkm.idx) AS geom
INTO parking_intersections
FROM intersections i
JOIN "_node_kerb_mapping" nkm
  ON i.way_id = nkm.way_id
  AND i.node_id = nkm.node_id
JOIN parking_kerbs kerb
  ON kerb.osm_id = nkm.way_id
WHERE kerb.tags->>'side' = 'right';


ALTER TABLE parking_intersections
ALTER COLUMN geom TYPE geometry(Geometry, 5243)
USING ST_SetSRID(geom, 5243);
