--https://trac.osgeo.org/postgis/ticket/2192
--TODO accept geography type AS parameter
CREATE OR REPLACE FUNCTION ST_Splap(geom1 geometry, geom2 geometry, double precision)
  RETURNS geometry AS 'SELECT ST_Split(ST_Snap($1, $2, $3), $2)'
  LANGUAGE sql IMMUTABLE STRICT COST 10;

-- --https://mygisnotes.wordpress.com/2017/01/01/split-lines-with-points-the-postgis-way/
-- CREATE OR REPLACE FUNCTION ST_AsMultiPoint(geometry) RETURNS geometry AS
-- 'SELECT ST_Union((d).geom) FROM ST_DumpPoints($1) AS d;'
-- LANGUAGE sql IMMUTABLE STRICT COST 10;

-- CREATE TEMP TABLE const (const_id text PRIMARY KEY, val text);
-- INSERT INTO const(const_id, val) VALUES
--   (  'local_srs', '25833')
-- ;

-- CREATE FUNCTION f_val(_id text)
--   RETURNS text LANGUAGE sql STABLE PARALLEL RESTRICTED AS
-- 'SELECT val FROM const WHERE const_id = $1';

-- insert highway=service into highways table when there are parking information
INSERT INTO highways
  (way_id, type, geom, surface, name, oneway, service, dual_carriageway, lanes, width, parking, parking_lane_left, parking_lane_right, parking_lane_width_proc, parking_lane_width_effective, parking_lane_left_position, parking_lane_right_position, parking_lane_left_width, parking_lane_right_width, parking_lane_left_width_carriageway, parking_lane_right_width_carriageway, parking_lane_left_offset, parking_lane_right_offset, parking_condition_left, parking_condition_left_other, parking_condition_right, parking_condition_right_other, parking_condition_left_other_time, parking_condition_right_other_time, parking_condition_left_default, parking_condition_right_default, parking_condition_left_time_interval, parking_condition_right_time_interval, parking_condition_left_maxstay, parking_condition_right_maxstay, parking_lane_left_capacity, parking_lane_right_capacity, parking_lane_left_source_capacity, parking_lane_right_source_capacity)
SELECT
  way_id, type, geom, surface, name, oneway, service, dual_carriageway, lanes, width, parking, parking_lane_left, parking_lane_right, parking_lane_width_proc, parking_lane_width_effective, parking_lane_left_position, parking_lane_right_position, parking_lane_left_width, parking_lane_right_width, parking_lane_left_width_carriageway, parking_lane_right_width_carriageway, parking_lane_left_offset, parking_lane_right_offset, parking_condition_left, parking_condition_left_other, parking_condition_right, parking_condition_right_other, parking_condition_left_other_time, parking_condition_right_other_time, parking_condition_left_default, parking_condition_right_default, parking_condition_left_time_interval, parking_condition_right_time_interval, parking_condition_left_maxstay, parking_condition_right_maxstay, parking_lane_left_capacity, parking_lane_right_capacity, parking_lane_left_source_capacity, parking_lane_right_source_capacity
FROM
  service
WHERE
  parking IN ('lane', 'street_side')
  AND service IS DISTINCT FROM 'parking_aisle'
  AND (parking_lane_left IN ('diagonal', 'marked', 'parallel', 'perpendicular', 'separate', 'yes')
  OR parking_lane_right IN ('diagonal', 'marked', 'parallel', 'perpendicular', 'separate', 'yes'))
;

--transform to local SRS , we can use meters instead of degree for calculations
--TODO check if all ST_* functions used are fine with geography type -> change to geography type
ALTER TABLE highways ADD COLUMN IF NOT EXISTS geog geography(LineString, 4326);
UPDATE highways SET geog = geom::geography;
ALTER TABLE highways ALTER COLUMN geom TYPE geometry(LineString, 25833) USING ST_Transform(geom, 25833);
ALTER TABLE highways ADD COLUMN IF NOT EXISTS angle numeric;
UPDATE highways SET angle = degrees(ST_Azimuth(ST_StartPoint(ST_Transform(geom, 25833)), ST_EndPoint(ST_Transform(geom, 25833))));
DROP INDEX IF EXISTS highways_geom_idx;
CREATE INDEX highways_geom_idx ON public.highways USING gist (geom);
DROP INDEX IF EXISTS highways_geog_idx;
CREATE INDEX highways_geog_idx ON public.highways USING gist (geog);

ALTER TABLE highways ADD COLUMN IF NOT EXISTS geog_buffer_left geography;
UPDATE highways SET geog_buffer_left = ST_Buffer(geog, 8, 'side=left');
ALTER TABLE highways ADD COLUMN IF NOT EXISTS geog_buffer_right geography;
UPDATE highways SET geog_buffer_right = ST_Buffer(geog, 8, 'side=right');

DROP INDEX IF EXISTS highways_geog_buffer_left_idx;
CREATE INDEX highways_geog_buffer_left_idx ON public.highways USING gist (geog_buffer_left);
DROP INDEX IF EXISTS highways_geog_buffer_right_idx;
CREATE INDEX highways_geog_buffer_right_idx ON public.highways USING gist (geog_buffer_right);

-- ALTER TABLE trees ADD COLUMN IF NOT EXISTS geog geography(Point, 4326);
-- UPDATE trees SET geog = geom::geography;
-- ALTER TABLE trees ADD COLUMN IF NOT EXISTS geog_buffer geography;
-- UPDATE trees SET geog_buffer = ST_Buffer(geog, 1);
-- DROP INDEX IF EXISTS trees_geog_buffer_idx;
-- CREATE INDEX trees_geog_buffer_idx ON public.trees USING gist (geog_buffer);

ALTER TABLE parking_poly ADD COLUMN IF NOT EXISTS geog geography;
UPDATE parking_poly SET geog = geom::geography;
DROP INDEX IF EXISTS parking_poly_geog_idx;
CREATE INDEX parking_poly_geog_idx ON public.parking_poly USING gist (geog);

ALTER TABLE service ADD COLUMN IF NOT EXISTS geog geography(LineString, 4326);
UPDATE service SET geog = ST_Transform(geom, 4326)::geography;
ALTER TABLE service ALTER COLUMN geom TYPE geometry(LineString, 25833) USING ST_Transform(geom, 25833);
ALTER TABLE service ADD COLUMN IF NOT EXISTS angle numeric;
UPDATE service SET angle = degrees(ST_Azimuth(ST_StartPoint(ST_Transform(geom, 25833)), ST_EndPoint(ST_Transform(geom, 25833))));
DROP INDEX IF EXISTS service_geom_idx;
CREATE INDEX service_geom_idx ON public.service USING gist (geom);
DROP INDEX IF EXISTS service_geog_idx;
CREATE INDEX service_geog_idx ON public.service USING gist (geog);


ALTER TABLE crossings ADD COLUMN IF NOT EXISTS geog geography(Point, 4326);
UPDATE crossings SET geog = geom::geography;
ALTER TABLE crossings ALTER COLUMN geom TYPE geometry(Point, 25833) USING ST_Transform(geom, 25833);
ALTER TABLE crossings ADD COLUMN IF NOT EXISTS geog_buffer geography;
UPDATE crossings SET geog_buffer = ST_Buffer(geog, 3);
DROP INDEX IF EXISTS crossings_geog_buffer_idx;
CREATE INDEX crossings_geog_buffer_idx ON public.crossings USING gist (geog_buffer);
DROP INDEX IF EXISTS crossings_geom_idx;
CREATE INDEX crossings_geom_idx ON public.crossings USING gist (geom);
DROP INDEX IF EXISTS crossings_geog_idx;
CREATE INDEX crossings_geog_idx ON public.crossings USING gist (geog);

ALTER TABLE pt_stops ADD COLUMN IF NOT EXISTS geog geography(Point, 4326);
UPDATE pt_stops SET geog = geom::geography;
ALTER TABLE pt_stops ALTER COLUMN geom TYPE geometry(Point, 25833) USING ST_Transform(geom, 25833);
DROP INDEX IF EXISTS pt_stops_geom_idx;
CREATE INDEX pt_stops_geom_idx ON public.pt_stops USING gist (geom);
DROP INDEX IF EXISTS pt_stops_geog_idx;
CREATE INDEX pt_stops_geog_idx ON public.pt_stops USING gist (geog);

ALTER TABLE ramps ADD COLUMN IF NOT EXISTS geog geography(Point, 4326);
UPDATE ramps SET geog = geom::geography;
ALTER TABLE ramps ALTER COLUMN geom TYPE geometry(Point, 25833) USING ST_Transform(geom, 25833);
DROP INDEX IF EXISTS ramps_geom_idx;
CREATE INDEX ramps_geom_idx ON public.ramps USING gist (geom);
DROP INDEX IF EXISTS ramps_geog_idx;
CREATE INDEX ramps_geog_idx ON public.ramps USING gist (geog);

ALTER TABLE amenity_parking_points ADD COLUMN IF NOT EXISTS geog geography(Point, 4326);
UPDATE amenity_parking_points SET geog = geom::geography;
ALTER TABLE amenity_parking_points ADD COLUMN IF NOT EXISTS geog_buffer geography;
UPDATE amenity_parking_points SET geog_buffer = ST_Buffer(geog, 1);
ALTER TABLE amenity_parking_points ALTER COLUMN geom TYPE geometry(Point, 25833) USING ST_Transform(geom, 25833);
DROP INDEX IF EXISTS amenity_parking_points_geog_buffer_idx;
CREATE INDEX amenity_parking_points_geog_buffer_idx ON public.amenity_parking_points USING gist (geog_buffer);
DROP INDEX IF EXISTS amenity_parking_points_geom_idx;
CREATE INDEX amenity_parking_points_geom_idx ON public.amenity_parking_points USING gist (geom);
DROP INDEX IF EXISTS amenity_parking_points_geog_idx;
CREATE INDEX amenity_parking_points_geog_idx ON public.amenity_parking_points USING gist (geog);

DROP TABLE IF EXISTS highway_union;
CREATE TABLE highway_union AS
WITH hw_union AS (
  SELECT
    row_number() over() id,
    name,
    array_agg(DISTINCT way_id) way_ids,
    (ST_LineMerge(ST_UNION(geog::geometry))) AS geom
  FROM highways
  WHERE type NOT LIKE '%_link'
  GROUP BY name
)
SELECT
  nextval('highway_union_id') id,
  h.name highway_name,
  h.way_ids,
  (ST_Dump(h.geom)).path part,
  (ST_Dump(h.geom)).geom geom,
  ((ST_Dump(h.geom)).geom)::geography geog
FROM
  hw_union h
;
ALTER TABLE highway_union ADD COLUMN IF NOT EXISTS geog_buffer geography;
UPDATE highway_union SET geog_buffer = ST_Buffer(geog, 1);
ALTER TABLE highway_union ADD COLUMN IF NOT EXISTS geog_buffer_left geography;
UPDATE highway_union SET geog_buffer_left = ST_Buffer(geog, 8, 'side=left');
ALTER TABLE highway_union ADD COLUMN IF NOT EXISTS geog_buffer_right geography;
UPDATE highway_union SET geog_buffer_right = ST_Buffer(geog, 8, 'side=right');
DROP INDEX IF EXISTS highway_union_geog_idx;
CREATE INDEX highway_union_geog_idx ON highway_union USING gist (geog);
DROP INDEX IF EXISTS highway_union_geog_buffer_left_idx;
CREATE INDEX highway_union_geog_buffer_idx ON highway_union USING gist (geog_buffer);
DROP INDEX IF EXISTS highway_union_geog_buffer_idx;
CREATE INDEX highway_union_geog_buffer_left_idx ON highway_union USING gist (geog_buffer_left);
DROP INDEX IF EXISTS highway_union_geog_buffer_right_idx;
CREATE INDEX highway_union_geog_buffer_right_idx ON highway_union USING gist (geog_buffer_right);

DROP TABLE IF EXISTS highway_crossings;
CREATE TABLE highway_crossings AS
SELECT
  row_number() over() id,
  count(DISTINCT h1.id) anzahl,
  ST_Intersection(h1.geog, h2.geog) geog,
  ST_Buffer(ST_Intersection(h1.geog, h2.geog), 5) geog_buffer,
  ST_Buffer(ST_Intersection(h1.geog, h2.geog), 10) geog_buffer10
FROM
  highway_union h1
  JOIN highway_union h2 ON ST_Intersects(h1.geog, h2.geog)
  and h1.id <> h2.id
  and h1.highway_name IS DISTINCT FROM h2.highway_name
GROUP BY
  ST_Intersection(h1.geog, h2.geog)
;
DROP INDEX IF EXISTS highway_crossings_geog_buffer_idx;
CREATE INDEX highway_crossings_geog_buffer_idx ON highway_crossings USING gist (geog_buffer);
DROP INDEX IF EXISTS highway_crossings_geog_idx;
CREATE INDEX highway_crossings_geog_idx ON highway_crossings USING gist (geog);

ALTER TABLE highways ADD COLUMN IF NOT EXISTS geom_shorten geometry;
UPDATE highways h
SET geom_shorten = ST_Transform(hc.geom_short, 25833)
FROM
  (
    SELECT
      h.id,
      st_difference(
        h.geog::geometry,
        ST_SetSRID(COALESCE(ST_Union(c.geog_buffer::geometry), 'GEOMETRYCOLLECTION EMPTY'::geometry), 4326)::geometry
      ) geom_short
    FROM
      highways h,
      highway_crossings c
    WHERE
      ST_Intersects(h.geog, c.geog_buffer)
    GROUP BY
      h.id , h.geog
  ) hc
WHERE
  h.id = hc.id
;

UPDATE highways h SET geom_shorten = ST_Transform(geom, 25833) WHERE geom_shorten IS NULL;

ALTER TABLE highways DROP COLUMN IF EXISTS geog_shorten;
ALTER TABLE highways ADD COLUMN IF NOT EXISTS geog_shorten geography(MultiLineString, 4326);
UPDATE highways SET geog_shorten = ST_Multi(ST_Transform(geom_shorten, 4326))::geography;

ALTER TABLE highways ADD COLUMN IF NOT EXISTS geog_shorten_buffer_left geography;
UPDATE highways SET geog_shorten_buffer_left = ST_Buffer(geog_shorten, 8, 'side=left');
ALTER TABLE highways ADD COLUMN IF NOT EXISTS geog_shorten_buffer_right geography;
UPDATE highways SET geog_shorten_buffer_right = ST_Buffer(geog_shorten, 8, 'side=right');

DROP INDEX IF EXISTS highways_geom_shorten_idx;
CREATE INDEX highways_geom_shorten_idx ON public.highways USING gist (geom_shorten);

DROP INDEX IF EXISTS highways_geog_shorten_buffer_left_idx;
CREATE INDEX highways_geog_shorten_buffer_left_idx ON public.highways USING gist (geog_shorten_buffer_left);
DROP INDEX IF EXISTS highways_geog_shorten_buffer_right_idx;
CREATE INDEX highways_geog_shorten_buffer_right_idx ON public.highways USING gist (geog_shorten_buffer_right);

DROP SEQUENCE IF EXISTS highway_segments_id;
CREATE SEQUENCE highway_segments_id;

DROP TABLE IF EXISTS highway_segments;
CREATE TABLE highway_segments AS
WITH crossing_intersecting_highways AS(
   SELECT
     h.id AS lines_id,
     h.highway_name AS highway_name,
     h.geog AS line_geog,
     (ST_Union(c.geog::geometry))::geography AS blade
   FROM highway_union h, highway_crossings c
   WHERE h.geog && c.geog_buffer
   GROUP BY h.id, h.highway_name, h.geog
)
SELECT
  nextval('highway_segments_id') id,
  lines_id,
  highway_name,
  --todo let ST_Splap accept geography
  ((ST_Dump(ST_Splap(line_geog::geometry, blade::geometry, 0.0000000000001))).geom)::geography geog
FROM
  crossing_intersecting_highways
;

ALTER TABLE highway_segments ADD COLUMN IF NOT EXISTS geog_buffer_left geography;
UPDATE highway_segments SET geog_buffer_left = ST_Buffer(geog, 8, 'side=left');
ALTER TABLE highway_segments ADD COLUMN IF NOT EXISTS geog_buffer_right geography;
UPDATE highway_segments SET geog_buffer_right = ST_Buffer(geog, 8, 'side=right');
ALTER TABLE highway_segments ADD COLUMN IF NOT EXISTS geog_buffer geography;
UPDATE highway_segments SET geog_buffer = ST_Buffer(geog, 8);

DROP INDEX IF EXISTS highway_segments_geog_buffer_left_idx;
CREATE INDEX highway_segments_geog_buffer_left_idx ON public.highway_segments USING gist (geog_buffer_left);
DROP INDEX IF EXISTS highway_segments_geog_buffer_right_idx;
CREATE INDEX highway_segments_geog_buffer_right_idx ON public.highway_segments USING gist (geog_buffer_right);
DROP INDEX IF EXISTS highway_segments_geog_buffer_idx;
CREATE INDEX highway_segments_geog_buffer_idx ON public.highway_segments USING gist (geog_buffer);


DROP SEQUENCE IF EXISTS pp_points_id;
CREATE SEQUENCE pp_points_id;

DROP TABLE IF EXISTS pp_points;
CREATE TABLE pp_points AS

SELECT
  nextval('pp_points_id') id,
  'right' side,
  pp.id pp_id,
  pp.access "access",
  pp.capacity capacity,
  pp.parking parking,
  pp.building building,
  pp.parking_orientation parking_orientation,
  pp.parking_street_side_of parking_street_side_of,
  pp.parking_street_side_of_name parking_street_side_of_name,
  hs.name highway_name,
  hs.id highway_id,
  ST_OrientedEnvelope(ST_Transform(pp.geom, 25833)) geom_envelope,
  ST_ConvexHull(pp.geom) geom_convex,
  ST_OrientedEnvelope(pp.geom) geom_concave,
  hs.geog highway_geog,
  pp.geog parking_geog,
  ((ST_DumpPoints(pp.geom)).geom)::geography <-> hs.geog distance,
  ((ST_DumpPoints(pp.geom)).path)[2] path,
  ((ST_DumpPoints(pp.geom)).geom)::geometry(Point, 4326),
  ((ST_DumpPoints(pp.geom)).geom)::geography geog,
  ST_Area(ST_Intersection(hs.geog_buffer_right, pp.geog)) intersection_aera
FROM
  parking_poly pp,
  highways hs
WHERE
  ST_Intersects(hs.geog_buffer_right, pp.geog)
  AND (pp.parking IN ('lane', 'street_side'))
  AND (pp.access NOT IN ('private') OR pp.access IS NULL)
UNION ALL
SELECT
  nextval('pp_points_id') id,
  'left' side,
  pp.id pp_id,
  pp.access "access",
  pp.capacity capacity,
  pp.parking parking,
  pp.building building,
  pp.parking_orientation parking_orientation,
  pp.parking_street_side_of parking_street_side_of,
  pp.parking_street_side_of_name parking_street_side_of_name,
  hs.name highway_name,
  hs.id highway_id,
  ST_OrientedEnvelope(ST_Transform(pp.geom, 25833)) geom_envelope,
  ST_ConvexHull(pp.geom) geom_convex,
  ST_OrientedEnvelope(pp.geom) geom_concave,
  hs.geog highway_geog,
  pp.geog parking_geog,
  ((ST_DumpPoints(pp.geom)).geom)::geography <-> hs.geog distance,
  ((ST_DumpPoints(pp.geom)).path)[2] path,
  ((ST_DumpPoints(pp.geom)).geom)::geometry(Point, 4326),
  ((ST_DumpPoints(pp.geom)).geom)::geography geog,
  ST_Area(ST_Intersection(hs.geog_buffer_left, pp.geog)) intersection_aera
FROM
  parking_poly pp,
  highways hs
WHERE
  ST_Intersects(hs.geog_buffer_left, pp.geog)
  AND (pp.parking IN ('lane', 'street_side'))
  AND (pp.access NOT IN ('private') OR pp.access IS NULL)
;
DROP INDEX IF EXISTS pp_points_geom_idx;
CREATE INDEX pp_points_geom_idx ON pp_points USING gist (geom);
DROP INDEX IF EXISTS pp_points_geog_idx;
CREATE INDEX pp_points_geog_idx ON pp_points USING gist (geog);


DROP SEQUENCE IF EXISTS pl_separated_id;
CREATE SEQUENCE pl_separated_id;

--let all points of every parking_poly fall down on highway_segment
--sort them by position along the the segment
--so we can ST_MakeLine a new line along the highway_segment
DROP TABLE IF EXISTS pl_separated;
CREATE TABLE pl_separated AS
SELECT
  nextval('pl_separated_id') id,
  h.id h_id,
  p.side,
  p.pp_id,
  ARRAY_AGG(DISTINCT h.name) highway_name,
  (MIN(p.distance) * -1) min_distance,
  (MAX(p.distance) * -1) max_distance,
  ST_Transform(
    ST_MakeLine(
      ST_ClosestPoint(
        ST_Transform(h.geog::geometry, 25833),
        ST_Transform(p.geom, 25833)
      ) ORDER BY
        ST_LineLocatePoint(
          ST_Transform(h.geog::geometry, 25833),
          ST_ClosestPoint(ST_Transform(h.geog::geometry, 25833), ST_Transform(p.geom, 25833))
        )
    ),
    4326
  )::geometry(Linestring, 4326) geom
FROM
  pp_points p
  JOIN LATERAL (
    SELECT
      h.*
    FROM
      highways h
    WHERE
      h.geog_buffer_right && p.geog
    ORDER BY
      --order by biggest intersection area
      ST_Area(ST_Intersection(h.geog_buffer_right, p.geog)) DESC,
      --afterwards by smallest distance
      p.geog <-> h.geog
    LIMIT 1
  ) AS h ON true
WHERE
  p.side = 'right'
  AND p.highway_name = h.name
GROUP BY
  p.pp_id,
  p.side,
  h.id
UNION ALL
SELECT
  nextval('pl_separated_id') id,
  h.id h_id,
  p.side,
  p.pp_id,
  ARRAY_AGG(DISTINCT h.name) highway_name,
  MIN(p.distance) min_distance,
  MAX(p.distance) max_distance,
  ST_Transform(
    ST_MakeLine(
      ST_ClosestPoint(
        ST_Transform(h.geog::geometry, 25833),
        ST_Transform(p.geom, 25833)
      ) ORDER BY
        ST_LineLocatePoint(
          ST_Transform(h.geog::geometry, 25833),
          ST_ClosestPoint(ST_Transform(h.geog::geometry, 25833), ST_Transform(p.geom, 25833))
        )
    ),
    4326
  )::geometry(Linestring, 4326) geom
FROM
  pp_points p
  JOIN LATERAL (
    SELECT
      h.*
    FROM
      highways h
    WHERE
      h.geog_buffer_left && p.geog
    ORDER BY
      --order by biggest intersection area
      ST_Area(ST_Intersection(h.geog_buffer_left, p.geog)) DESC,
      --afterwards by smallest distance
      p.geog <-> h.geog
    LIMIT 1
  ) AS h ON true
WHERE
  p.side = 'left'
  AND p.highway_name = h.name
GROUP BY
  p.pp_id,
  p.side,
  h.id
;
ALTER TABLE pl_separated ADD COLUMN IF NOT EXISTS geog geography(LineString, 4326);
UPDATE pl_separated SET geog = geom::geography;
DROP INDEX IF EXISTS pl_separated_geom_idx;
CREATE INDEX pl_separated_geom_idx ON pl_separated USING gist (geom);
DROP INDEX IF EXISTS pl_separated_geog_idx;
CREATE INDEX pl_separated_geog_idx ON pl_separated USING gist (geog);

DROP TABLE IF EXISTS pl_separated_union;
CREATE TABLE pl_separated_union AS
SELECT
  row_number() over() id,
  p.h_id,
  p.side,
  MIN(p.min_distance) min_distance,
  (ST_LineMerge(ST_Union(p.geom)))::geography geog
FROM
  pl_separated p
WHERE
  ST_Length(p.geog) > 1.7
GROUP BY
  p.side, p.h_id
;
DROP INDEX IF EXISTS pl_separated_union_geog_idx;
CREATE INDEX pl_separated_union_geog_idx ON pl_separated_union USING gist (geog);


DROP SEQUENCE IF EXISTS parking_lanes_id;
CREATE SEQUENCE parking_lanes_id;

DROP TABLE IF EXISTS parking_lanes;
CREATE TABLE parking_lanes AS
SELECT
  nextval('parking_lanes_id') id,
  a.way_id,
  v.side,
  a.type highway,
  a.name "highway:name",
  a.parking_lane_width_proc "highway:width_proc",
  a.parking_lane_width_effective "highway:width_proc:effective",
  a.surface,
  a.parking,
  CASE WHEN v.side = 'left' THEN a.parking_lane_left
       WHEN v.side = 'right' THEN a.parking_lane_right
  END "orientation",
  CASE WHEN v.side = 'left' THEN a.parking_lane_left_position
       WHEN v.side = 'right' THEN a.parking_lane_right_position
  END "position",
  CASE WHEN v.side = 'left' THEN a.parking_condition_left
       WHEN v.side = 'right' THEN a.parking_condition_right
  END "condition",
  CASE WHEN v.side = 'left' THEN a.parking_condition_left_other
       WHEN v.side = 'right' THEN a.parking_condition_right_other
  END "condition:other",
  CASE WHEN v.side = 'left' THEN a.parking_condition_left_other_time
       WHEN v.side = 'right' THEN a.parking_condition_right_other_time
  END "condition:other:time",
  CASE WHEN v.side = 'left' THEN a.parking_condition_left_maxstay
       WHEN v.side = 'right' THEN a.parking_condition_right_maxstay
  END maxstay,
  CASE
    WHEN v.side = 'left' AND a.parking_lane_left_capacity IS NOT NULL THEN a.parking_lane_left_capacity
    WHEN v.side = 'right' AND a.parking_lane_right_capacity IS NOT NULL THEN a.parking_lane_right_capacity
    ELSE NULL
  END capacity_osm,
  CASE
    WHEN v.side = 'left' AND a.parking_lane_left_capacity IS NOT NULL THEN a.parking_lane_left_source_capacity
    WHEN v.side = 'right' AND a.parking_lane_right_capacity IS NOT NULL THEN a.parking_lane_right_source_capacity
    ELSE NULL
  END "source:capacity_osm",
  0 capacity,
  'estimated' "source:capacity",
  CASE WHEN v.side = 'left' THEN a.parking_lane_left_width_carriageway
       WHEN v.side = 'right' THEN a.parking_lane_right_width_carriageway
  END width,
  CASE WHEN v.side = 'left' THEN a.parking_lane_left_offset
       WHEN v.side = 'right' THEN a.parking_lane_right_offset
  END "offset",
  CASE
    -- before offsetting we cut out all separated parking lanes
    WHEN v.side IN ('left') THEN
      ST_Transform(
        ST_OffsetCurve(
          ST_Transform(
            st_difference(
              a.geog::geometry,
              ST_SetSRID(COALESCE(ST_Buffer(s.geog, 0.2), 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
            ),
            25833
          ),
          a.parking_lane_left_offset
        ), 4326
      )::geography
    WHEN v.side IN ('right') THEN
      ST_Transform(
        ST_OffsetCurve(
          ST_Transform(
            st_difference(
              a.geog::geometry,
              ST_SetSRID(COALESCE(ST_Buffer(s.geog, 0.2), 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
            ),
            25833
          ),
          a.parking_lane_right_offset
        ), 4326
      )::geography
  END geog,
  CASE
    -- before offsetting we cut out all separated parking lanes
    WHEN v.side IN ('left') THEN
      ST_Transform(
        ST_OffsetCurve(
          ST_Transform(
            st_difference(
              a.geog_shorten::geometry,
              ST_SetSRID(COALESCE(ST_Buffer(s.geog, 0.2), 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
            ),
            25833
          ),
          a.parking_lane_left_offset
        ), 4326
      )::geography
    WHEN v.side IN ('right') THEN
      ST_Transform(
        ST_OffsetCurve(
          ST_Transform(
            st_difference(
              a.geog_shorten::geometry,
              ST_SetSRID(COALESCE(ST_Buffer(s.geog, 0.2), 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
            ),
            25833
          ),
          a.parking_lane_right_offset
        ), 4326
      )::geography
  END geog_shorten,
  (a.error_output#>>'{}')::jsonb error_output
FROM
  (VALUES ('left'), ('right')) AS v(side)
  CROSS JOIN
  highways a
  LEFT JOIN pl_separated_union s ON ST_Intersects(s.geog, ST_Buffer(a.geog, 0.2)) AND v.side = s.side
UNION ALL
SELECT
  nextval('parking_lanes_id') id,
  h.way_id way_id,
  pl.side,
  h.type highway,
  h.name "highway:name",
  NULL "highway:width_proc",
  NULL "highway:width_proc:effective",
  NULL surface,
  p.parking,
  p.parking_orientation "orientation",
  NULL "position",
  NULL "condition",
  NULL "condition:other",
  NULL "condition:other:time",
  NULL maxstay,
  p.capacity capacity_osm,
  'OSM' "source:capacity_osm",
  CASE
    WHEN p.capacity IS NULL THEN round(ST_Area(p.geog) / 12.2)
    ELSE p.capacity
  END capacity,
  CASE
    WHEN p.capacity IS NULL THEN 'estimated'
    ELSE 'OSM'
  END "source:capacity",
  NULL width,
  pl.min_distance "offset", --offset could also be h.parking_lane_*_offset
  ST_Transform(ST_OffsetCurve(ST_Simplify(ST_Transform(ST_LineMerge(pl.geog::geometry), 25833), (ST_Length(ST_Transform(ST_LineMerge(pl.geog::geometry), 25833)) * 0.1)), pl.min_distance), 4326)::geography geog,
  'GEOMETRYCOLLECTION EMPTY'::geography geog_shorten,
  '{}'::jsonb error_output
FROM
  pl_separated pl
  LEFT JOIN parking_poly p ON p.id = pl.pp_id
  JOIN LATERAL (
    SELECT
      h.*
    FROM
      highways h
    WHERE
      h.geog_buffer_right && p.geog
      OR h.geog_buffer_left && p.geog
    ORDER BY
      --order by biggest intersection area
      ST_Area(ST_Intersection(h.geog_buffer_right, p.geog)) + ST_Area(ST_Intersection(h.geog_buffer_left, p.geog)) DESC,
      --afterwards by smallest distance
      p.geog <-> h.geog
    LIMIT 1
  ) AS h ON true
;
ALTER TABLE IF EXISTS public.parking_lanes ALTER COLUMN id SET NOT NULL;
ALTER TABLE IF EXISTS public.parking_lanes ADD PRIMARY KEY (id);
CREATE UNIQUE INDEX parking_lanes_pk_idx ON public.parking_lanes USING btree (id ASC NULLS LAST);
DROP INDEX IF EXISTS parking_lanes_geog_idx;
CREATE INDEX parking_lanes_geog_idx ON parking_lanes USING gist (geog);
DROP INDEX IF EXISTS parking_lanes_geog_shorten_idx;
CREATE INDEX parking_lanes_geog_shorten_idx ON parking_lanes USING gist (geog_shorten);

DROP SEQUENCE IF EXISTS pt_bus_id;
CREATE SEQUENCE pt_bus_id;

DROP TABLE IF EXISTS pt_bus;
CREATE TABLE pt_bus AS
SELECT
  nextval('pt_bus_id') id,
  p.node_id,
  p.id pt_id,
  p.name,
  'right' side,
  ST_Transform(
    ST_OffsetCurve(
      --get highway intersection with buffered bus_stop
      ST_Intersection(
        ST_Transform((h.geog)::geometry, 25833),
        --buffer bus_stop with 15 m
        ST_Buffer(
          --snap bus_stop on highway
          ST_ClosestPoint(
            ST_Transform(h.geog::geometry, 25833),
            ST_Transform(p.geog::geometry, 25833)
          )
          , 15
        )
      )
      , h.parking_lane_right_offset
    )
    , 4326
  ) geom
FROM
  pt_stops p
  JOIN LATERAL (
    SELECT
      h.*
    FROM
      highways h
    WHERE
      ST_Intersects(h.geog_buffer_right, p.geog)
    ORDER BY
      p.geog <-> h.geog
    LIMIT 1
  ) AS h ON true
WHERE
  p.geog && h.geog_buffer_right
  AND p.highway = 'bus_stop'
UNION ALL
SELECT
  nextval('pt_bus_id') id,
  p.node_id,
  p.id pt_id,
  p.name,
  'left' side,
  ST_Transform(
    ST_OffsetCurve(
      --get highway intersection with buffered bus_stop
      ST_Intersection(
        ST_Transform((h.geog)::geometry, 25833),
        --buffer bus_stop with 15 m
        ST_Buffer(
          --snap bus_stop on highway
          ST_ClosestPoint(
            ST_Transform(h.geog::geometry, 25833),
            ST_Transform(p.geog::geometry, 25833)
          )
          , 15
        )
      )
      , h.parking_lane_left_offset
    )
    , 4326
  ) geom
FROM
  pt_stops p
  JOIN LATERAL (
    SELECT
      h.*
    FROM
      highways h
    WHERE
      ST_Intersects(h.geog_buffer_left, p.geog)
    ORDER BY
      p.geog <-> h.geog
    LIMIT 1
  ) AS h ON true
WHERE
  p.geog && h.geog_buffer_left
  AND p.highway = 'bus_stop'
;
--TODO dont do this
DELETE FROM pt_bus WHERE ST_GeometryType(geom) = 'ST_MultiLineString';

ALTER TABLE pt_bus ADD COLUMN IF NOT EXISTS geog geography(LineString, 4326);
UPDATE pt_bus SET geog = geom::geography;

DROP INDEX IF EXISTS pt_bus_geom_idx;
CREATE INDEX pt_bus_geom_idx ON public.pt_bus USING gist (geom);
DROP INDEX IF EXISTS pt_bus_geog_idx;
CREATE INDEX pt_bus_geog_idx ON public.pt_bus USING gist (geog);


DROP TABLE IF EXISTS buffer_pt_bus;
CREATE TABLE buffer_pt_bus AS
SELECT
  p.id,
  (ST_Union(ST_Buffer(b.geog, 1, 'endcap=flat')::geometry))::geography geog
FROM
  parking_lanes p JOIN pt_bus b ON st_intersects(b.geog, p.geog)
WHERE
  p.parking NOT IN ('street_side')
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_pt_bus_geog_idx;
CREATE INDEX buffer_pt_bus_geog_idx ON buffer_pt_bus USING gist (geog);

DROP SEQUENCE IF EXISTS pt_tram_id;
CREATE SEQUENCE pt_tram_id;

DROP TABLE IF EXISTS pt_tram;
CREATE TABLE pt_tram AS
SELECT
  nextval('pt_tram_id') id,
  p.node_id,
  p.id pt_tram_id,
  p.name,
  'right' side,
  ST_Transform(
    ST_OffsetCurve(
      --get highway intersection with buffered tram_stop
      ST_Intersection(
        ST_Transform((h.geog)::geometry, 25833),
        --buffer tram_stop with 15 m
        ST_Buffer(
          --snap tram_stop on highway
          ST_ClosestPoint(
            ST_Transform(h.geog::geometry, 25833),
            ST_Transform(p.geog::geometry, 25833)
          )
          , 15
        )
      )
      , h.parking_lane_right_offset
    )
    , 4326
  ) geom
FROM
  pt_stops p
  JOIN LATERAL (
    SELECT
      h.*
    FROM
      highways h
    WHERE
      ST_Intersects(h.geog_buffer_right, p.geog)
    ORDER BY
      p.geog <-> h.geog
    LIMIT 1
  ) AS h ON true
WHERE
  p.geog && h.geog_buffer_right
  AND p.railway = 'tram_stop'
UNION ALL
SELECT
  nextval('pt_tram_id') id,
  p.node_id,
  p.id pt_tram_id,
  p.name,
  'left' side,

  ST_Transform(
    ST_OffsetCurve(
      --get highway intersection with buffered tram_stop
      ST_Intersection(
        ST_Transform((h.geog)::geometry, 25833),
        --buffer tram_stop with 15 m
        ST_Buffer(
          --snap tram_stop on highway
          ST_ClosestPoint(
            ST_Transform(h.geog::geometry, 25833),
            ST_Transform(p.geog::geometry, 25833)
          )
          , 15
        )
      )
      , CASE WHEN h.oneway THEN h.parking_lane_right_offset ELSE h.parking_lane_left_offset END
    )
    , 4326
  ) geom
FROM
  pt_stops p
  JOIN LATERAL (
    SELECT
      h.*
    FROM
      highways h
    WHERE
      ST_Intersects(h.geog_buffer_left, p.geog)
    ORDER BY
      p.geog <-> h.geog
    LIMIT 1
  ) AS h ON true
WHERE
  p.geog && h.geog_buffer_left
  AND p.railway = 'tram_stop'
;
--TODO dont do this
DELETE FROM pt_tram WHERE ST_GeometryType(geom) = 'ST_MultiLineString';

ALTER TABLE pt_tram ADD COLUMN IF NOT EXISTS geog geography(LineString, 4326);
UPDATE pt_tram SET geog = geom::geography;

DROP INDEX IF EXISTS pt_tram_geom_idx;
CREATE INDEX pt_tram_geom_idx ON public.pt_tram USING gist (geom);
DROP INDEX IF EXISTS pt_tram_geog_idx;
CREATE INDEX pt_tram_geog_idx ON public.pt_tram USING gist (geog);

DROP TABLE IF EXISTS buffer_pt_tram;
CREATE TABLE buffer_pt_tram AS
SELECT
  p.id,
  (ST_Union(ST_Buffer(b.geog, 1, 'endcap=flat')::geometry))::geography geog
FROM
  parking_lanes p JOIN pt_tram b ON st_intersects(b.geog, p.geog)
WHERE
  p.parking NOT IN ('street_side')
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_pt_tram_geog_idx;
CREATE INDEX buffer_pt_tram_geog_idx ON buffer_pt_tram USING gist (geog);


DROP TABLE IF EXISTS parking_lanes_single;
CREATE TABLE parking_lanes_single AS
SELECT
    row_number() over() id,
    id pl_id,
    way_id,
    side,
    highway,
    "highway:name",
    "highway:width_proc",
    "highway:width_proc:effective",
    surface,
    parking,
    orientation,
    "position",
    condition,
    "condition:other",
    "condition:other:time",
    maxstay,
    capacity_osm,
    "source:capacity_osm",
    capacity,
    "source:capacity",
    width,
    "offset",
    geog geog_multi,
    error_output,
    (ST_DUMP(pl.geog::geometry)).path,
    ((ST_DUMP(pl.geog::geometry)).geom)::geography geog
FROM
  parking_lanes pl
;
DROP INDEX IF EXISTS parking_lanes_single_geog_idx;
CREATE INDEX parking_lanes_single_geog_idx ON parking_lanes_single USING gist (geog);


DROP TABLE IF EXISTS ped_crossings;
CREATE TABLE ped_crossings AS
SELECT DISTINCT ON (p.side, c.id)
  row_number() over() id,
  c.node_id,
  c.id crossing_id,
  p.side,
  h.way_id highway_id,
  c.highway,
  c.crossing,
  c.crossing_ref,
  c.kerb,
  c.crossing_buffer_marking "crossing:buffer_marking",
  c.crossing_kerb_extension "crossing:kerb_extension",
  c.traffic_signals_direction "traffic_signals:direction",
  h.parking_lane_width_proc "width_proc",
  CASE
    WHEN p.side IN ('left') THEN h.parking_lane_left_width_carriageway
    WHEN p.side IN ('right') THEN h.parking_lane_right_width_carriageway
  END "parking:lane:width:carriageway",
  h.parking_lane_left_width_carriageway "parking:lane:left:width:carriageway",
  h.parking_lane_right_width_carriageway "parking:lane:right:width:carriageway",
  c.geom geom,
  CASE
    WHEN p.side IN ('left') THEN ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography
    WHEN p.side IN ('right') THEN ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography
  END geog_offset,
  CASE
     WHEN p.side IN ('left') THEN
       CASE
        WHEN c.highway = 'traffic_signals' AND c.traffic_signals_direction IN ('backward') THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 10)
        WHEN c.highway = 'traffic_signals' AND c.traffic_signals_direction NOT IN ('forward', 'backward') AND ST_Intersects(ST_Buffer(p.geog, COALESCE(p.offset, 4), 'side=left endcap=flat'), c.geog) THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 10)
        WHEN c.crossing_kerb_extension = 'both' OR c.crossing_buffer_marking = 'both' THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 3)
        WHEN c.crossing_kerb_extension = p.side OR c.crossing_buffer_marking = p.side THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 3)
        WHEN c.crossing = 'zebra' OR c.crossing_ref = 'zebra' OR c.crossing = 'traffic_signals' THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 4.5)
        WHEN c.crossing = 'marked' THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 2)
        --ELSE ST_Buffer(c.geog, 1)
      END
    WHEN p.side IN ('right') THEN
      CASE
        WHEN c.highway = 'traffic_signals' AND c.traffic_signals_direction IN ('forward') THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 10)
        WHEN c.highway = 'traffic_signals' AND c.traffic_signals_direction NOT IN ('forward', 'backward') AND ST_Intersects(ST_Buffer(p.geog, COALESCE(p.offset, 4), 'side=left endcap=flat'), c.geog) THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 10)
        WHEN c.crossing_kerb_extension = 'both' OR c.crossing_buffer_marking = 'both' THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 3)
        WHEN c.crossing_kerb_extension = p.side OR c.crossing_buffer_marking = p.side THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 3)
        WHEN c.crossing = 'zebra' OR c.crossing_ref = 'zebra' OR c.crossing = 'traffic_signals' THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 4.5)
        WHEN c.crossing = 'marked' THEN ST_Buffer(ST_Transform(ST_ClosestPoint(ST_Transform(p.geog::geometry, 25833), c.geom), 4326)::geography, 2)
        --ELSE ST_Buffer(c.geog, 1)
      END
  END geog_offset_buffer,
  c.geog geom_crossing
FROM
  crossings c
  JOIN highways h ON ST_Intersects(c.geog_buffer, h.geog)
  JOIN LATERAL (
    SELECT
      p.*
    FROM
      parking_lanes_single p
    WHERE
      p.way_id = h.way_id
      AND p.geog && h.geog
    ORDER BY
      p.geog <-> c.geog
    LIMIT 2
  ) AS p ON true
WHERE
  ("crossing_buffer_marking" IS NOT NULL
  OR "crossing_kerb_extension" IS NOT NULL
  OR c.highway IN ('traffic_signals', 'crossing') )
  AND NOT (c.crossing IN ('unmarked') AND c.highway = 'crossing' AND COALESCE("crossing_buffer_marking", "crossing_kerb_extension") IS NULL)
;
DROP INDEX IF EXISTS ped_crossings_geog_offset_buffer_idx;
CREATE INDEX ped_crossings_geog_offset_buffer_idx ON ped_crossings USING gist (geog_offset_buffer);


DROP TABLE IF EXISTS ssr;
CREATE TABLE ssr AS
SELECT
  row_number() over() id,
  s.type,
  s.surface,
  s.name,
  s.parking,
  s.parking_lane_left,
  s.parking_lane_right,
  s.parking_lane_width_proc,
  s.parking_lane_width_effective,
  s.parking_lane_left_position,
  s.parking_lane_right_position,
  s.parking_lane_left_width,
  s.parking_lane_right_width,
  s.parking_lane_left_width_carriageway,
  s.parking_lane_right_width_carriageway,
  s.parking_lane_left_offset,
  s.parking_lane_right_offset,
  (s.error_output#>>'{}')::jsonb error_output,
  ST_Buffer(ST_Intersection(s.geog, h.geog), (h.parking_lane_width_proc / 2) + 5) geog
FROM service s
  JOIN highways h ON ST_Intersects(s.geog, h.geog)
WHERE
 s.parking_lane_left IS NOT NULL
 OR s.parking_lane_right IS NOT NULL
;
DROP INDEX IF EXISTS ssr_geog_idx;
CREATE INDEX ssr_geog_idx ON ssr USING gist (geog);

DROP TABLE IF EXISTS driveways;
CREATE TABLE driveways AS
SELECT
  row_number() over() id,
  s.type,
  s.surface,
  s.name,
  s.parking,
  s.parking_lane_left,
  s.parking_lane_right,
  s.parking_lane_width_proc,
  s.parking_lane_width_effective,
  s.parking_lane_left_position,
  s.parking_lane_right_position,
  s.parking_lane_left_width,
  s.parking_lane_right_width,
  s.parking_lane_left_width_carriageway,
  s.parking_lane_right_width_carriageway,
  s.parking_lane_left_offset,
  s.parking_lane_right_offset,
  (s.error_output#>>'{}')::jsonb error_output,
  ST_Buffer(ST_Intersection(s.geog, p.geog), GREATEST((s.parking_lane_width_proc / 2), 2) ) geog
FROM service s
  JOIN parking_lanes p ON ST_Intersects(s.geog, p.geog)
WHERE
  s.geog && p.geog
  AND s.type IN ('service')
;
DROP INDEX IF EXISTS driveways_geog_idx;
CREATE INDEX driveways_geog_idx ON driveways USING gist (geog);

DROP TABLE IF EXISTS kerb_intersection_points;
CREATE TABLE kerb_intersection_points AS
SELECT
  row_number() over() id,
  a.id pl_id,
  a.side,
  a."highway" AS "type",
  a."highway:name" AS "name",
  a.orientation parking_lane,
  a.position parking_lane_position,
  a.width parking_lane_width,
  a.offset parking_lane_offset,
  CASE
    WHEN (a.orientation NOT IN ('no','no_stopping','no_parking') AND b.orientation IN ('no','no_stopping','no_parking'))
      OR (a.orientation IN ('no','no_stopping','no_parking') AND b.orientation NOT IN ('no','no_stopping','no_parking')) THEN 'no_stop'
    WHEN a.highway IS NOT DISTINCT FROM b.highway
      AND a."highway:name" IS NOT DISTINCT FROM b."highway:name"
      AND a.side IS NOT DISTINCT FROM b.side
      AND a.orientation IS NOT DISTINCT FROM b.orientation
      AND a.parking IS NOT DISTINCT FROM b.parking THEN 'same_street'
    WHEN a."highway" IN ('pedestrian')
      OR b."highway" IN ('pedestrian') THEN 'pedestrian'
    ELSE 'other'
  END crossing_debug,
  ST_CollectionExtract(ST_Intersection(a.geog::geometry, b.geog::geometry), 1)::geography geog,
  ST_Buffer(ST_CollectionExtract(ST_Intersection(a.geog::geometry, b.geog::geometry), 1)::geography, 3) geog_buffer
FROM
  parking_lanes a,
  parking_lanes b
WHERE
  ST_Intersects(a.geog, b.geog)
  AND a.id <> b.id
;
DROP INDEX IF EXISTS kerb_intersection_points_geog_idx;
CREATE INDEX kerb_intersection_points_geog_idx ON kerb_intersection_points USING gist (geog);
DROP INDEX IF EXISTS kerb_intersection_points_geog_buffer_idx;
CREATE INDEX kerb_intersection_points_geog_buffer_idx ON kerb_intersection_points USING gist (geog_buffer);


DROP TABLE IF EXISTS buffer_driveways;
CREATE TABLE buffer_driveways AS
SELECT
  p.id,
  (ST_Union(d.geog::geometry))::geography geog
FROM
  parking_lanes p JOIN driveways d ON st_intersects(d.geog, p.geog)
WHERE
  d.type <> 'footway'
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_driveways_geog_idx;
CREATE INDEX buffer_driveways_geog_idx ON buffer_driveways USING gist (geog);

DROP TABLE IF EXISTS buffer_pedestrian_crossings;
CREATE TABLE buffer_pedestrian_crossings AS
SELECT
  p.id,
  (ST_Union(c.geog_offset_buffer::geometry))::geography geog
FROM
  ped_crossings c JOIN parking_lanes p ON st_intersects(p.geog, c.geog_offset_buffer)
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_pedestrian_crossings_geog_idx;
CREATE INDEX buffer_pedestrian_crossings_geog_idx ON buffer_pedestrian_crossings USING gist (geog);

DROP TABLE IF EXISTS buffer_kerb_intersections;
CREATE TABLE buffer_kerb_intersections AS
SELECT
  p.id,
  (ST_Union((k.geog_buffer)::geometry))::geography geog
FROM
  kerb_intersection_points k JOIN parking_lanes p ON st_intersects(p.geog, k.geog_buffer)
WHERE
  k.crossing_debug NOT IN ('same_street')
  AND p.geog && k.geog_buffer
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_kerb_intersections_geog_idx;
CREATE INDEX buffer_kerb_intersections_geog_idx ON buffer_kerb_intersections USING gist (geog);

DROP TABLE IF EXISTS buffer_highways;
CREATE TABLE buffer_highways AS
SELECT
  p.id,
  ST_Transform((ST_Union(h.geog_buffer::geometry)),4326)::geography geog
FROM
  highway_union h JOIN parking_lanes p ON st_intersects(p.geog, h.geog_buffer)
WHERE p.geog && h.geog_buffer
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_highways_geog_idx;
CREATE INDEX buffer_highways_geog_idx ON buffer_highways USING gist (geog);

DROP TABLE IF EXISTS buffer_ramps;
CREATE TABLE buffer_ramps AS
SELECT
  p.id,
  (ST_Union(ST_Buffer(r.geog, 1.4)::geometry))::geography geog
FROM
  parking_lanes p JOIN ramps r ON st_intersects(ST_Buffer(r.geog, 1.4), p.geog)
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_ramps_geog_idx;
CREATE INDEX buffer_ramps_geog_idx ON buffer_ramps USING gist (geog);

DROP TABLE IF EXISTS buffer_amenity_parking_points;
CREATE TABLE buffer_amenity_parking_points AS
SELECT
  p.id,
  (ST_Union(b.geog_buffer::geometry))::geography geog
FROM
  parking_lanes p JOIN amenity_parking_points b ON st_intersects(b.geog_buffer, p.geog)
GROUP BY
  p.id
;
DROP INDEX IF EXISTS buffer_amenity_parking_points_geog_idx;
CREATE INDEX buffer_amenity_parking_points_geog_idx ON buffer_amenity_parking_points USING gist (geog);

DROP TABLE IF EXISTS pl_dev;
CREATE TABLE pl_dev AS
SELECT
  DISTINCT p.id id,
  p.way_id way_id,
  p.side side,
  p.highway highway,
  p."highway:name" "highway:name",
  p."highway:width_proc" "highway:width_proc",
  p."highway:width_proc:effective" "highway:width_proc:effective",
  p.surface surface,
  p.parking parking,
  p.orientation orientation,
  p."position" "position",
  p.condition condition,
  p."condition:other" "condition:other",
  p."condition:other:time" "condition:other:time",
  p.maxstay maxstay,
  p.capacity_osm capacity_osm,
  p."source:capacity_osm" "source:capacity_osm",
  p.capacity capacity,
  p."source:capacity" "source:capacity",
  p.width width,
  p."offset" "offset",
  p.geog geog,
  p.error_output,
  st_difference(
    st_difference(
      st_difference(
        st_difference(
          st_difference(
            st_difference(
              st_difference(
                st_difference(
                  CASE WHEN p.geog_shorten = 'GEOMETRYCOLLECTION EMPTY'::geography THEN p.geog::geometry ELSE p.geog_shorten::geometry END,
                  ST_SetSRID(COALESCE(bc.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
                ),
                ST_SetSRID(COALESCE(t.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
              ),
              ST_SetSRID(COALESCE(b.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
            ),
            ST_SetSRID(COALESCE(r.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
          ),
          ST_SetSRID(COALESCE(d.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
        ),
        ST_SetSRID(COALESCE(c.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
      ),
      ST_SetSRID(COALESCE(k.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
    ),
    ST_SetSRID(COALESCE(hb.geog, 'GEOMETRYCOLLECTION EMPTY'::geography), 4326)::geometry
  )::geography geog_diff,
  d.geog driveway_geog,
  c.geog ped_crossing_geog,
  k.geog kerbs_geog,
  hb.geog highways_buffer_geog,
  r.geog ramps_geog,
  b.geog bus_geog,
  t.geog tram_geog,
  bc.geog bike_geog
FROM
  parking_lanes p
  LEFT JOIN buffer_driveways d ON p.id = d.id
  LEFT JOIN buffer_ramps r ON p.id = r.id
  LEFT JOIN buffer_pedestrian_crossings c ON p.id = c.id
  LEFT JOIN buffer_kerb_intersections k ON p.id = k.id
  LEFT JOIN buffer_pt_bus b ON p.id = b.id
  LEFT JOIN buffer_pt_tram t ON p.id = t.id
  LEFT JOIN buffer_highways hb ON p.id = hb.id
  LEFT JOIN buffer_amenity_parking_points bc ON p.id = bc.id
;


DROP TABLE IF EXISTS pl_dev_geog;
CREATE TABLE pl_dev_geog AS
WITH defval AS (
  SELECT
    5.2 vehicle_dist_para,
    3.1 vehicle_dist_diag,
    2.5 vehicle_dist_perp,
    4.4 vehicle_length,
    1.8 vehicle_width
), dv AS (
  SELECT
    *,
    sqrt(d.vehicle_width * 0.5 * d.vehicle_width) + sqrt(d.vehicle_length * 0.5 * d.vehicle_length) vehicle_diag_width
  FROM defval d
), single_geog AS (
SELECT
    h.*,
    (ST_DUMP(h.geog_diff::geometry)).path,
    ((ST_DUMP(h.geog_diff::geometry)).geom)::geography simple_geog
FROM
  pl_dev h
)
SELECT
    COALESCE((single.way_id::text  || '.' || single.path[1]::text), single.way_id::text) way_id,
    row_number() over() id,
    single.side side ,
    single.highway highway ,
    single."highway:name" "highway:name",
    single."highway:width_proc" "highway:width_proc",
    single."highway:width_proc:effective" "highway:width_proc:effective",
    single.surface surface,
    single.parking parking,
    single.orientation orientation,
    single."position" "position",
    single.condition condition,
    single."condition:other" "condition:other",
    single."condition:other:time" "condition:other:time",
    single.maxstay maxstay,
    single.capacity_osm capacity_osm,
    single."source:capacity_osm" "source:capacity_osm",
    CASE
      WHEN side = 'left' AND single.capacity IS NOT NULL AND single.capacity <> 0 THEN single.capacity
      WHEN side = 'left' AND single.capacity IS NULL OR single.capacity = 0 THEN
        CASE
          WHEN single.orientation = 'parallel' AND ST_Length(single.simple_geog) > dv.vehicle_length THEN floor((ST_Length(single.simple_geog) + (dv.vehicle_dist_para - dv.vehicle_length)) / dv.vehicle_dist_para)
          WHEN single.orientation = 'diagonal' AND ST_Length(single.simple_geog) > dv.vehicle_diag_width THEN floor((ST_Length(single.simple_geog) + (dv.vehicle_dist_diag - dv.vehicle_diag_width)) / dv.vehicle_dist_diag)
          WHEN single.orientation = 'perpendicular' AND ST_Length(single.simple_geog) > dv.vehicle_width THEN floor((ST_Length(single.simple_geog) + (dv.vehicle_dist_perp - dv.vehicle_width)) / dv.vehicle_dist_perp)
        END
      WHEN side = 'right' AND single.capacity IS NOT NULL AND single.capacity <> 0 THEN single.capacity
      WHEN side = 'right' AND single.capacity IS NULL OR single.capacity = 0 THEN
        CASE
          WHEN single.orientation = 'parallel' AND ST_Length(single.simple_geog) > dv.vehicle_length THEN floor((ST_Length(single.simple_geog) + (dv.vehicle_dist_para - dv.vehicle_length)) / dv.vehicle_dist_para)
          WHEN single.orientation = 'diagonal' AND ST_Length(single.simple_geog) > dv.vehicle_diag_width THEN floor((ST_Length(single.simple_geog) + (dv.vehicle_dist_diag - dv.vehicle_diag_width)) / dv.vehicle_dist_diag)
          WHEN single.orientation = 'perpendicular' AND ST_Length(single.simple_geog) > dv.vehicle_width THEN floor((ST_Length(single.simple_geog) + (dv.vehicle_dist_perp - dv.vehicle_width)) / dv.vehicle_dist_perp)
        END
    END capacity,
    CASE
      WHEN single."source:capacity" IS NOT NULL AND single.capacity <> 0 THEN single."source:capacity"
      WHEN single."source:capacity" IS NULL OR single.capacity = 0 THEN 'estimated'
    END "source:capacity",
    single.width width,
    single."offset" "offset",
    single.geog single_geog,
    single.error_output,
    single.geog_diff geog_diff,
    (single.simple_geog)::geography geog
FROM
  single_geog single,
  dv
;

DROP TABLE IF EXISTS parking_segments;
CREATE TABLE parking_segments AS
SELECT
    way_id way_id,
    id id,
    side side,
    highway highway,
    "highway:name" highway_name,
    "highway:width_proc" highway_width_proc,
    "highway:width_proc:effective" highway_width_proc_effective,
    surface surface,
    parking parking,
    orientation orientation,
    "position" "position",
    condition condition,
    "condition:other" condition_other,
    "condition:other:time" condition_other_time,
    maxstay maxstay,
    capacity_osm capacity_osm,
    "source:capacity_osm" source_capacity_osm,
    capacity capacity,
    "source:capacity" source_capacity,
    width width,
    "offset" "offset",
    ST_Length(geog) "length",
    ST_Length(geog) / COALESCE(capacity, 1) length_per_capacity,
    error_output,
    geog::geometry(LineString, 4326) geom,
    geog
FROM pl_dev_geog
WHERE
  ST_Length(geog) > 1.7
  --AND capacity IS NOT NULL
;
DROP INDEX IF EXISTS parking_segments_geom_idx;
CREATE INDEX parking_segments_geom_idx ON parking_segments USING gist (geom);
DROP INDEX IF EXISTS parking_segments_geog_idx;
CREATE INDEX parking_segments_geog_idx ON parking_segments USING gist (geog);

DROP TABLE IF EXISTS parking_spaces;
CREATE TABLE parking_spaces AS
SELECT
    way_id way_id,
    id id,
    side side,
    highway highway,
    "highway:name" highway_name,
    "highway:width_proc" highway_width_proc,
    "highway:width_proc:effective" highway_width_proc_effective,
    surface surface,
    parking parking,
    orientation orientation,
    "position" "position",
    condition condition,
    "condition:other" condition_other,
    "condition:other:time" condition_other_time,
    maxstay maxstay,
    capacity_osm capacity_osm,
    "source:capacity_osm" source_capacity_osm,
    capacity capacity,
    "source:capacity" source_capacity,
    width width,
    "offset" "offset",
    error_output,
    CASE
      WHEN orientation = 'diagonal' THEN degrees(ST_Azimuth(ST_Startpoint(ST_Transform(geog::geometry, 25832)), ST_EndPoint(ST_Transform(geog::geometry, 25832)))) + 45
      WHEN orientation = 'perpendicular' THEN degrees(ST_Azimuth(ST_Startpoint(ST_Transform(geog::geometry, 25832)), ST_EndPoint(ST_Transform(geog::geometry, 25832)))) + 90
      ELSE degrees(ST_Azimuth(ST_Startpoint(ST_Transform(geog::geometry, 25832)), ST_EndPoint(ST_Transform(geog::geometry, 25832))))
    END angle,
    CASE
      WHEN  1 / capacity BETWEEN 0 AND 1 THEN
        ST_Multi(ST_LineInterpolatePoints(geog::geometry(LineString, 4326), 1 / capacity, true))::geometry(Multipoint, 4326)
      ELSE NULL
    END geom
FROM pl_dev_geog
WHERE
  ST_Length(geog) > 1.7
  --AND capacity IS NOT NULL
;
ALTER TABLE parking_spaces ALTER COLUMN geom TYPE geometry(Multipoint, 4326);

DROP INDEX IF EXISTS parking_spaces_geom_idx;
CREATE INDEX parking_spaces_geom_idx ON parking_spaces USING gist (geom);

DROP TABLE IF EXISTS parking_summary;
CREATE TABLE parking_summary AS
SELECT
  h.id,
  h.highway_name,
  SUM(p.capacity) capacity,
  h.geog,
  h.geog::geometry(LineString, 4326) geom
FROM
  highway_segments h
  LEFT JOIN  parking_segments p ON ST_Intersects(h.geog_buffer, p.geom::geography)
WHERE
  p.geom::geography && h.geog_buffer
GROUP BY
  h.id, h.highway_name, h.geog
;
DROP INDEX IF EXISTS parking_summary_geom_idx;
CREATE INDEX parking_summary_geom_idx ON parking_summary USING gist (geom);
DROP INDEX IF EXISTS parking_summary_geog_idx;
CREATE INDEX parking_summary_geog_idx ON parking_summary USING gist (geog);


DROP TABLE IF EXISTS  highways_admin;
CREATE TABLE highways_admin AS
SELECT
  ROW_NUMBER() OVER() id,
  b.name admin_name,
  b.admin_level,
  h.way_id,
  h.type,
  h.surface,
  h.name,
  h.oneway,
  h.service,
  h.dual_carriageway,
  h.lanes,
  h.width,
  h.parking,
  h.parking_lane_left,
  h.parking_lane_right,
  h.parking_lane_width_proc,
  h.parking_lane_width_effective,
  h.parking_lane_left_position,
  h.parking_lane_right_position,
  h.parking_lane_left_width,
  h.parking_lane_right_width,
  h.parking_lane_left_width_carriageway,
  h.parking_lane_right_width_carriageway,
  h.parking_lane_left_offset,
  h.parking_lane_right_offset,
  h.parking_condition_left,
  h.parking_condition_left_other,
  h.parking_condition_right,
  h.parking_condition_right_other,
  h.parking_condition_left_other_time,
  h.parking_condition_right_other_time,
  h.parking_condition_left_default,
  h.parking_condition_right_default,
  h.parking_condition_left_time_interval,
  h.parking_condition_right_time_interval,
  h.parking_condition_left_maxstay,
  h.parking_condition_right_maxstay,
  h.parking_lane_left_capacity,
  h.parking_lane_right_capacity,
  h.parking_lane_left_source_capacity,
  h.parking_lane_right_source_capacity,
  ST_Intersection(h.geom, b.geom) geom,
  ST_Intersection(h.geog, b.geog) geog
FROM
  boundaries b,
  highways h
WHERE
  h.geog && b.geog
  AND b.admin_level IN (4, 9, 10)
  AND h.type IN ('primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link', 'residential', 'unclassified', 'living_street', 'pedestrian, road')
;
DROP INDEX IF EXISTS highways_admin_geom_idx;
CREATE INDEX highways_admin_geom_idx ON public.highways_admin USING gist (geom);
DROP INDEX IF EXISTS highways_admin_geog_idx;
CREATE INDEX highways_admin_geog_idx ON public.highways_admin USING gist (geog);

DROP TABLE IF EXISTS boundaries_stats;
CREATE TABLE boundaries_stats AS
SELECT
  ROW_NUMBER() OVER() id,
  b.name,
  b.admin_level,
  ROUND(ST_Area(b.geog)::numeric / (1000 * 1000), 2)  aera_sqkm,
  COALESCE(ROUND((SUM(ST_Length(h.geog)) FILTER (WHERE dual_carriageway IS NULL AND parking IN ('street_side')))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog) / 2) FILTER (WHERE dual_carriageway = true AND parking IN ('street_side')))::numeric / 1000, 1), 0) AS street_side_km,

  COALESCE(ROUND((SUM(ST_Length(h.geog)) FILTER (WHERE dual_carriageway IS NULL AND parking IN ('lane')))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog) / 2) FILTER (WHERE dual_carriageway = true AND parking IN ('lane')))::numeric / 1000, 1), 0) AS lane_km,

  COALESCE(ROUND((SUM(ST_Length(h.geog)) FILTER (WHERE dual_carriageway IS NULL AND parking IS NULL))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog) / 2) FILTER (WHERE dual_carriageway = true AND parking IS NULL))::numeric / 1000, 1), 0) AS d_other_km,

  COALESCE(ROUND((SUM(ST_Length(h.geog)) FILTER (WHERE dual_carriageway IS NULL AND parking IN ('street_side')))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog) / 2) FILTER (WHERE dual_carriageway = true AND parking IN ('street_side')))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog)) FILTER (WHERE dual_carriageway IS NULL AND parking IN ('lane')))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog) / 2) FILTER (WHERE dual_carriageway = true AND parking IN ('lane')))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog)) FILTER (WHERE dual_carriageway IS NULL AND parking IS NULL))::numeric / 1000, 1), 0) +
  COALESCE(ROUND((SUM(ST_Length(h.geog) / 2) FILTER (WHERE dual_carriageway = true AND parking IS NULL))::numeric / 1000, 1), 0) AS sum_km,
  ROUND((SUM(ST_Length(h.geog)) / 1000)::numeric, 1) "length_wo_dual_carriageway",
  b.geog::geometry(MultiPolygon, 4326) geom
FROM
  boundaries b,
  highways_admin h
WHERE
  ST_Intersects(h.geom, b.geom)
  AND h.admin_level = b.admin_level
  AND h.admin_level IN (4, 9, 10)
  AND h.type IN ('primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link', 'residential', 'unclassified', 'living_street', 'pedestrian, road')
  AND b.name NOT IN ('Gosen', 'Lindenberg', 'Schönerlinde')
GROUP BY
  b.name, b.admin_level, b.geog
ORDER BY
  b.name
;
DROP INDEX IF EXISTS boundaries_stats_geom_idx;
CREATE INDEX boundaries_stats_geom_idx ON boundaries_stats USING gist (geom);
ALTER TABLE boundaries_stats ADD COLUMN IF NOT EXISTS done_percent numeric;
UPDATE boundaries_stats SET done_percent = ROUND((street_side_km + lane_km) / sum_km * 100, 1);
