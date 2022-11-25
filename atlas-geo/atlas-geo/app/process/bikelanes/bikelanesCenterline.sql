-- What happens:
-- we project to cartesian coordinates
-- move the geometry by `offset` (+ left / - right)
-- because negative offsets reverse the order and we want the right side to be aligned we reverse the order again
-- additionally we check wether the geometry is `simple` because otherwise we might get a MLString
-- TODO: check parameters `quad_segs` and  `join`
-- INSERT INTO "bikelanes" SELECt osm_type, osm_id, tags,
--   ST_Reverse(
--     ST_Transform(
--       ST_OffsetCurve(
--           ST_Transform(geom, 25833), "offset", 'quad_segs=4 join=round'), 3857))
--             as geom
--   FROM "bikelanes_toTranslate"
--   WHERE ST_IsSimple(geom);

UPDATE "bikelanesCenterlineNew"
  SET geom=ST_Reverse(ST_Transform(ST_OffsetCurve(ST_Transform(geom, 25833), "offset", 'quad_segs=4 join=round'), 3857))
  WHERE ST_IsSimple(geom) and not ST_IsClosed(geom);

-- Query below shows the geometries that would result in MultiLineString
-- SELECT * from "bikelanesCenterline" WHERE not ST_IsSimple(geom) or ST_IsClosed(geom);

-- INSERT INTO "bikelanes"
--   SELECT osm_type, osm_id, tags, geom
--   FROM "bikelanesCenterline";
