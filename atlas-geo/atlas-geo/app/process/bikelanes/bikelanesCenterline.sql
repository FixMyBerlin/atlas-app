-- What happens:
-- we project to cartesian coordinates
-- move the geometry by `offset` (+ left / - right)
-- because negative offsets reverse the order and we want the right side to be aligned we reverse the order again
-- additionally we check wether the geometry is `simple` because otherwise we might get a MLString
-- TODO: check parameters `quad_segs` and  `join`
UPDATE "bikelanesCenterlineNew"
  SET geom=ST_Reverse(ST_Transform(ST_OffsetCurve(ST_Simplify(ST_Transform(geom, 25833), 0.05), "offset", 'quad_segs=4 join=round'), 3857))
  WHERE ST_IsSimple(geom) and not ST_IsClosed(geom) and "offset"!=0;

-- need to get the query below into lua, otherwise updating tables won't work
-- UPDATE "bikelanesCenterlineNew"
--   SET osm_id=osm_id*SIGN("offset");


INSERT INTO "bikelanesNew"
  SELECT osm_type, osm_id, tags, category, meta, geom
  FROM "bikelanesCenterlineNew";

-- Query below shows the geometries that would result in MultiLineString
-- SELECT * from "bikelanesCenterline" WHERE not ST_IsSimple(geom) or ST_IsClosed(geom);
