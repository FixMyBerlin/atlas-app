DROP TABLE IF EXISTS parking_intersections;

-- we define intersections as either:
--  1. nodes that are part of more than 2 roads
--  2. nodes that are part of exactly 2 roads of which at least one is not ending at the node
--  (a T-junction where one road is not splitted)
-- we can select these nodes from the _node_road_mapping table
WITH
  intersections AS (
    SELECT
      nrm.node_id,
      COUNT(nrm.way_id) + SUM((NOT is_terminal_node)::INT) AS degree,
      SUM(is_service::INT) + SUM(
        (
          NOT is_terminal_node
          AND is_service
        )::INT
      ) AS service_degree,
      MIN(nrm.way_id) AS way_id,
      BOOL_OR(is_service) as is_service
    FROM
      _node_road_mapping nrm
    GROUP BY
      nrm.node_id
    HAVING
      COUNT(nrm.way_id) > 1
  )
SELECT
  i.node_id,
  i.degree,
  i.service_degree,
  i.is_service,
  ST_PointN (road.geom, nrm.idx) AS geom INTO parking_intersections
FROM
  intersections i
  JOIN _node_road_mapping nrm ON i.way_id = nrm.way_id
  AND i.node_id = nrm.node_id
  JOIN _parking_roads road ON road.osm_id = nrm.way_id
WHERE
  i.degree > 2;

ALTER TABLE parking_intersections
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_intersections_idx ON parking_intersections USING BTREE (node_id);

DO $$
BEGIN
  RAISE NOTICE 'Finished finding intersections at %', clock_timestamp();
END
$$;
