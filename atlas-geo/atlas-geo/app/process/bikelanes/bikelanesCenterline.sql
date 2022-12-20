-- What happens:
-- we project to cartesian coordinates
-- move the geometry by `offset` (+ left / - right)
-- because negative offsets reverse the order and we want the right side to be aligned we reverse the order again
-- additionally we check wether the geometry is `simple` because otherwise we might get a MLString
-- TODO: check parameters `quad_segs` and  `join`
UPDATE "bikelanesCenterline"
  SET geom=ST_Reverse(ST_Transform(ST_OffsetCurve(ST_Simplify(ST_Transform(geom, 25833), 0.05), "offset", 'quad_segs=4 join=round'), 3857))
  WHERE ST_IsSimple(geom) and not ST_IsClosed(geom) and "offset"!=0;

--IDEA: maybe we can transform closed geometries with some sort of buffer function:
-- at least for the cases where we buffer "outside"(side=right) this should always yield a LineString

-- We need a unique osm_id for our frontend code. As a workaround we use the offset sign.
-- In turn this brakes updating tables via osm2pgsql
UPDATE "bikelanesCenterline"
  SET osm_id=osm_id*SIGN("offset");


INSERT INTO "_bikelanes_temp"
  SELECT osm_type, osm_id, tags, meta, geom
  FROM "bikelanesCenterline";

-- Query below shows the geometries that would result in MultiLineString
-- SELECT * from "bikelanesCenterline" WHERE not ST_IsSimple(geom) or ST_IsClosed(geom);
