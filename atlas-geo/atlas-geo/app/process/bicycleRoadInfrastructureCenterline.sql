-- What happens:
-- we project to cartesian coordinates
-- move the geometry by `offset` (+ left / - right)
-- because negative offsets reverse the order and we want the right side to be aligned we reverse the order again
-- additionally we check wether the geometry is `simple` because otherwise we might get a MLString
-- TODO: check parameters `quad_segs` and  `join`
-- insert into "bicycleRoadInfrastructure" select osm_type, osm_id, tags, ST_Reverse(
--                                                                           ST_Transform(
--                                                                             ST_OffsetCurve(
--                                                                                 ST_Transform(geom, 25833), "offset", 'quad_segs=4 join=round'), 3857))
--                                                                                 as geom FROM "bicycleRoadInfrastructure_toTranslate" where ST_IsSimple(geom);

update "bicycleRoadInfrastructureCenterline" set geom=ST_Reverse(ST_Transform(ST_OffsetCurve(ST_Transform(geom, 25833), "offset", 'quad_segs=4 join=round'), 3857)) where ST_IsSimple(geom);
insert into "bicycleRoadInfrastructureCenterline" select osm_type, osm_id, tags, geom from "bicycleRoadInfrastructure";
