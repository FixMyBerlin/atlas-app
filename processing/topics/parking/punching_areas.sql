DROP TABLE IF EXISTS parking_punching_areas;

-- INSERT driveway buffers (rectangles)
-- @var: "5" is the buffer in meter where no parking is allowed legally
SELECT
  -- TODO: Create a unique ID. Right now all 4 nodes in a crossing have the same ID. There is nothing (except the geom) to make them distinct.
  'node/' || intersection_id AS id,
  ST_Buffer (geom, 5) as geom,
  jsonb_build_object(
    /* sql-formatter-disable */
    'category', 'intersection_corner',
    'size', 5
    /* sql-formatter-enable */
  ) AS tags,
  '{}'::jsonb AS meta,
  0 AS minzoom
  --
  INTO parking_punching_areas
FROM
  parking_intersection_corners;

-- INSERT driveway buffers (rectangles)
INSERT INTO
  parking_punching_areas (id, geom, tags, meta, minzoom)
SELECT
  id,
  ST_Buffer (
    geom,
    ((tags ->> 'width')::float / 2)::float,
    'endcap=flat'
  ) as geom,
  jsonb_build_object(
    /* sql-formatter-disable */
    'size', ((tags ->> 'width')::float / 2)::float,
    'category', 'driveway',
    'highway', tags ->> 'highway',
    'road', tags ->> 'road',
    'width', tags ->> 'width'
    /* sql-formatter-enable */
  ) AS tags,
  jsonb_build_object('updated_at', meta ->> 'updated_at') AS meta,
  0 AS minzoom
FROM
  parking_driveways;

-- MISC
ALTER TABLE parking_punching_areas
ALTER COLUMN geom TYPE geometry (Geometry, 5243) USING ST_SetSRID (geom, 5243);

CREATE INDEX parking_punching_areas_geom_idx ON parking_intersections USING GIST (geom);

DO $$
BEGIN
  RAISE NOTICE 'Finished creating punching areas at %', clock_timestamp();
END
$$;
