DROP TABLE IF EXISTS parking_intersections;

-- we define intersections as either:
--  1. nodes that are part of more than 2 roads
--  2. nodes that are part of exactly 2 roads of which at least one is not ending at the node
--  (a T-junction where one road is not splitted)
-- we can select these nodes from the _node_kerb_mapping table
WITH
  intersections AS (
    SELECT
      nkm.node_id,
      COUNT(nkm.way_id) AS way_count,
      MIN(nkm.way_id) AS way_id
    FROM
      _node_kerb_mapping nkm
      JOIN parking_roads r ON nkm.way_id = r.osm_id
    GROUP BY
      nkm.node_id
    HAVING
      COUNT(nkm.way_id) > 2
      OR (
        COUNT(nkm.way_id) = 2
        AND NOT bool_and(nkm.is_terminal_node)
      )
  )
SELECT
  i.node_id,
  i.way_id,
  i.way_count,
  ST_PointN (road.geom, nkm.idx) AS geom INTO parking_intersections
FROM
  intersections i
  JOIN _node_kerb_mapping nkm ON i.way_id = nkm.way_id
  AND i.node_id = nkm.node_id
  JOIN parking_roads road ON road.osm_id = nkm.way_id;

ALTER TABLE parking_intersections
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_intersections_idx ON parking_intersections USING BTREE (node_id, way_id);

DO $$
BEGIN
  RAISE NOTICE 'Finished finding intersections';
END
$$;
