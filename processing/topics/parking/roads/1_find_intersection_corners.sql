CREATE OR REPLACE FUNCTION find_intersection_corners (intersection_id BIGINT, degree INT) RETURNS TABLE (intersection geometry) AS $$
BEGIN
  RETURN QUERY
  WITH kerbs AS (
    SELECT id, geom
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
    ORDER BY angle_between_roads(k1.osm_id, k2.osm_id) ASC
    LIMIT degree
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
  CROSS JOIN LATERAL find_intersection_corners (i.node_id) AS corners;

ALTER TABLE parking_intersection_corners
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);
