-- PREPARE
DROP TABLE IF EXISTS parking_intersections;

-- CREATE intersections table
-- We define intersections as either:
--  1. nodes that are part of more than 2 roads
--  2. nodes that are part of exactly 2 roads of which at least one is not ending at the node
--  (a T-junction where one road is not splitted)
-- We can select these nodes from the _parking_node_road_mapping table.
--
-- `degree` – the number of ways that start/end at a node
-- `driveway_degree` – the number of driveway-ways that start/end at a node
WITH
  intersections AS (
    SELECT
      nrm.node_id,
      SUM(1 + (NOT is_terminal_node)::INT) AS degree,
      SUM(
        is_driveway::INT + (
          NOT is_terminal_node
          AND is_driveway
        )::INT
      ) AS driveway_degree,
      MIN(nrm.way_id) AS way_id
    FROM
      _parking_node_road_mapping nrm
    GROUP BY
      nrm.node_id
    HAVING
      COUNT(nrm.way_id) > 1
  )
SELECT
  i.node_id,
  i.degree,
  i.driveway_degree,
  ST_PointN (road.geom, nrm.idx) AS geom INTO parking_intersections
FROM
  intersections i
  JOIN _parking_node_road_mapping nrm ON i.way_id = nrm.way_id
  AND i.node_id = nrm.node_id
  JOIN _parking_roads road ON road.osm_id = nrm.way_id
WHERE
  i.degree > 2;

-- MISC
ALTER TABLE parking_intersections
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_intersections_idx ON parking_intersections USING BTREE (node_id);

DO $$
BEGIN
  RAISE NOTICE 'Finished finding intersections at %', clock_timestamp();
END
$$;
