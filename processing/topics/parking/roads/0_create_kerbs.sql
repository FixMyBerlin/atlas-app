DROP TABLE IF EXISTS parking_kerbs;

SELECT
  ROW_NUMBER() OVER () as id,
  kerb_sides.side,
  kerb_sides.geom,
  osm_type,
  osm_id,
  tags,
  meta,
  minzoom INTO parking_kerbs
FROM
  _parking_roads
  CROSS JOIN LATERAL (
    VALUES
      (
        'left',
        ST_OffsetCurve (geom, (tags ->> 'offset_left')::numeric)
      ),
      (
        'right',
        ST_OffsetCurve (geom, (tags ->> 'offset_right')::numeric)
      )
  ) AS kerb_sides (side, geom);

ALTER TABLE parking_kerbs
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_kerbs_moved_idx ON parking_kerbs USING BTREE (osm_id);

CREATE INDEX parking_kerbs_moved_idx ON parking_kerbs USING BTREE (osm_id, side);

CREATE INDEX parking_kerbs_moved_geom_idx ON parking_kerbs USING GIST (geom);

DO $$
BEGIN
  RAISE NOTICE 'Finished moving kerbs';
END
$$;
