CREATE OR REPLACE FUNCTION intersection_angle (
  intersection_id BIGINT,
  road_id1 BIGINT,
  road_id2 BIGINT
) RETURNS double precision AS $$
DECLARE
  azimuth_road1 double precision;
  azimuth_road2 double precision;
  intersection_angle double precision;
BEGIN

   -- calculate the azimuth of the two roads at the intersection point
  WITH end_segments AS (
    SELECT
      way_id,
      idx,
      CASE
        WHEN idx = 1 THEN idx + 1
        ELSE idx - 1
      END AS idx_next
    FROM _node_kerb_mapping
    WHERE node_id = intersection_id
      AND way_id IN (road_id1, road_id2)
  ),
  azimuths AS (
    SELECT
      es.way_id,
      ST_Azimuth(
        ST_PointN(r.geom, es.idx),
        ST_PointN(r.geom, es.idx_next)
      ) AS azimuth
    FROM end_segments es
    JOIN parking_roads r ON r.osm_id = es.way_id
  )
  SELECT
    (SELECT azimuth FROM azimuths WHERE way_id = road_id1),
    (SELECT azimuth FROM azimuths WHERE way_id = road_id2)
  INTO azimuth_road1, azimuth_road2;

  -- calculate the angle difference
  intersection_angle := abs(azimuth_road1 - azimuth_road2);

  IF intersection_angle > pi() THEN
    RETURN (2 * pi()) - intersection_angle;
  END IF;

  RETURN intersection_angle;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION find_intersection_corners (intersection_id BIGINT, max_degree INT) RETURNS TABLE (intersection geometry) AS $$
BEGIN
  RETURN QUERY
  WITH kerbs AS (
    SELECT id, osm_id, geom
    FROM parking_kerbs_moved
    WHERE osm_id IN (
      SELECT way_id
      FROM _node_kerb_mapping
      WHERE node_id = intersection_id
    )
  ),
  kerb_pairs AS (
    SELECT
      k1.id AS id1,
      k2.id AS id2,
      ST_Intersection(k1.geom, k2.geom) AS geom
    FROM kerbs k1
    JOIN kerbs k2
      ON k1.id < k2.id  -- prevent duplicates and self-joins
    WHERE ST_Intersects(k1.geom, k2.geom)
    AND degrees(intersection_angle (intersection_id, k1.osm_id, k2.osm_id)) < max_degree
  )
  SELECT
    geom
  FROM kerb_pairs
  WHERE NOT ST_IsEmpty(geom)
    AND GeometryType(geom) = 'POINT';
END;
$$ LANGUAGE plpgsql STABLE;

DROP TABLE IF EXISTS parking_intersection_corners;

DROP INDEX IF EXISTS parking_kerbs_moved_idx;

CREATE INDEX parking_kerbs_moved_idx ON parking_kerbs_moved USING GIST (geom);

SELECT
  i.node_id as intersection_id,
  i.way_count,
  corners as geom INTO parking_intersection_corners
FROM
  parking_intersections as i
  CROSS JOIN LATERAL find_intersection_corners (i.node_id, 140) AS corners;

ALTER TABLE parking_intersection_corners
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);
