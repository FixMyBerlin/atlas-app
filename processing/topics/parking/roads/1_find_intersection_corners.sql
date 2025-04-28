-- TODO: sometimes we miss intersection corners because the roads are splitted close to the intersection, see: https://tiles-inspector.netlify.app/#20.12/52.4714732/13.3406221
CREATE OR REPLACE FUNCTION intersection_angle (
  intersection_id BIGINT,
  road_id1 BIGINT,
  road_id2 BIGINT
) RETURNS double precision AS $$
DECLARE
  smallest_angle double precision;
BEGIN
  -- for each pair of intersction_id and way_id, get the index of the node in the way
  -- and the index of the next node in the way. For n > 1 this is n - 1 for n = 1 this is n + 1
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
  -- calculate the azimuths of the two roads at the intersection point
  -- for loops we have more than one pair of intersection_id and way_id
  azimuths AS (
    SELECT
      es.way_id,
      ST_Azimuth(
        ST_PointN(r.geom, es.idx),
        ST_PointN(r.geom, es.idx_next)
      ) AS azimuth
    FROM end_segments es
    JOIN parking_roads r ON r.osm_id = es.way_id
  ),
  intersection_angles AS (
    SELECT
      abs(a1.azimuth - a2.azimuth) AS angle
    FROM azimuths a1
    JOIN azimuths a2
      ON a1.way_id < a2.way_id
  )
  -- Get the smallest angle (adjust for angles greater than pi)
  SELECT
    MIN(CASE
          WHEN angle > pi() THEN 2 * pi() - angle
          ELSE angle
        END)
  INTO smallest_angle
  FROM intersection_angles;

  RETURN smallest_angle;
END;

$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION find_intersection_corners (intersection_id BIGINT, max_degree INT) RETURNS TABLE (intersection geometry) AS $$
BEGIN
  RETURN QUERY
  -- get the ways that are connected to the intersection
  WITH intersection_roads AS (
    SELECT way_id
    FROM _node_kerb_mapping
    WHERE node_id = intersection_id
  ),
  -- for each pair of roads, calculate the angle between them
  -- and filter out the pairs that have too shallow angles
  road_pairs AS (
    SELECT
      r1.way_id AS road_id1,
      r2.way_id AS road_id2
    FROM intersection_roads r1
    JOIN intersection_roads r2
      ON r1.way_id < r2.way_id -- prevent duplicates and self-joins
    WHERE degrees(intersection_angle (intersection_id, r1.way_id, r2.way_id)) < max_degree
  ),
  -- for each pair of roads get the moved kerbs and look for intersections
  kerb_pairs AS (
    SELECT
      ST_Intersection(kerb1.geom, kerb2.geom) AS geom
    FROM road_pairs rp
    JOIN parking_kerbs_moved kerb1 ON kerb1.osm_id = rp.road_id1
    JOIN parking_kerbs_moved kerb2 ON kerb2.osm_id = rp.road_id2
    WHERE ST_Intersects(kerb1.geom, kerb2.geom)
  )
  SELECT
    geom
  FROM kerb_pairs
  WHERE NOT ST_IsEmpty(geom)
    AND GeometryType(geom) = 'POINT';
END;
$$ LANGUAGE plpgsql STABLE;

DROP TABLE IF EXISTS parking_intersection_corners;

-- for each road intersection where the roads incide with an angle smaller than 140 degrees
-- find the intersection points of the kerbs
SELECT
  i.node_id as intersection_id,
  i.way_count,
  corners as geom INTO parking_intersection_corners
FROM
  parking_intersections as i
  CROSS JOIN LATERAL find_intersection_corners (i.node_id, 140) AS corners;

ALTER TABLE parking_intersection_corners
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

DO $$
BEGIN
  RAISE NOTICE 'Finished calculating intersection corners';
END
$$;
