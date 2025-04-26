CREATE OR REPLACE FUNCTION find_intersection_corners(
  center geometry,
  radius double precision
)
RETURNS TABLE(intersection geometry) AS $$
BEGIN
  RETURN QUERY
  WITH kerbs_within_r AS (
    SELECT id, geom
    FROM parking_kerbs_moved
    WHERE ST_DWithin(geom, center, radius)
  ),
  kerb_pairs AS (
    SELECT
      k1.id AS id1,
      k2.id AS id2,
      ST_Intersection(k1.geom, k2.geom) AS geom
    FROM kerbs_within_r k1
    JOIN kerbs_within_r k2
      ON k1.id < k2.id  -- prevent duplicates and self-joins
    WHERE ST_Intersects(k1.geom, k2.geom)
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
  corners as geom
INTO parking_intersection_corners
FROM
  parking_intersections as i
CROSS JOIN LATERAL
  find_intersection_corners(i.geom, 15) AS corners;

ALTER TABLE parking_intersection_corners
ALTER COLUMN geom TYPE geometry(Geometry, 5243)
USING ST_SetSRID(geom, 5243);
