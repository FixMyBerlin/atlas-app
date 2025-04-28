DROP TABLE IF EXISTS parking_kerbs_moved;

SELECT
  osm_type,
  osm_id,
  id,
  tags,
  meta,
  ST_OffsetCurve (geom, (tags ->> 'perform_move')::numeric) as geom,
  minzoom INTO parking_kerbs_moved
FROM
  parking_kerbs;

ALTER TABLE parking_kerbs_moved
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_kerbs_moved_idx ON parking_kerbs_moved USING GIST (geom);

DO $$
BEGIN
  RAISE NOTICE 'Finished moving kerbs';
END
$$;
