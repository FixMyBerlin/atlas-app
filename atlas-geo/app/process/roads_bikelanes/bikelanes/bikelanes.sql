-- remove categories which are only used for checking the presence of data

-- What happens here:
-- we project to cartesian coordinates
-- move the geometry by `_offset` (+ left / - right)
-- because negative offsets reverse the order and we want the right side to be aligned we reverse the order again
-- additionally we check wether the geometry is `simple` because otherwise we might get a MLString
-- for the same reason we simplify the geometries
-- TODO: check parameters `quad_segs` and  `join`
UPDATE "_bikelanes_temp"
  SET geom=ST_Transform(ST_OffsetCurve(ST_Simplify(ST_Transform(geom, 25833), 0.5), "_offset"), 3857)
  WHERE ST_IsSimple(geom) and not ST_IsClosed(geom) and "_offset"!=0;

UPDATE "_bikelanes_temp"
  SET geom=ST_Reverse(geom)
  WHERE "_offset">0;
-- We need a unique osm_id for our frontend code. As a workaround we use the offset sign.
-- In turn this brakes updating tables via osm2pgsql
UPDATE "_bikelanes_temp"
  SET osm_id=osm_id*SIGN("_offset") WHERE "_offset"!=0;

-- ALTER TABLE "_bikelanes_temp" DROP COLUMN "_offset";

--IDEA: maybe we can transform closed geometries with some sort of buffer function:
-- at least for the cases where we buffer "outside"(side=right) this should always yield a LineString
-- IDEA 2: scale around center of geom (would require to estimate the scaling factor)


-- Query below shows the geometries that would result in MultiLineString
-- SELECT * from "_bikelanes_temp" WHERE not ST_IsSimple(geom) or ST_IsClosed(geom);
