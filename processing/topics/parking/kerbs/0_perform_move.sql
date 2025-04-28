DROP TABLE IF EXISTS parking_kerbs_moved;

SELECT
  osm_type,
  osm_id,
  id,
  tags,
  meta,
  ST_OffsetCurve (
    ST_Simplify (geom, 0.5),
    (tags ->> 'perform_move')::numeric
  ) as geom,
  minzoom INTO parking_kerbs_moved
FROM
  parking_kerbs
WHERE
  st_issimple (geom)
  and st_isvalid (geom)
  and not st_isclosed (geom);

ALTER TABLE parking_kerbs_moved
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_kerbs_moved_idx ON parking_kerbs_moved USING GIST (geom);
