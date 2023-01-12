-- DELETE * FROM "maxspeed_transformed";
INSERT INTO "maxspeed_transformed"
  SELECT   maxspeed.osm_type, maxspeed.osm_id, maxspeed.category, maxspeed.tags, maxspeed.meta, maxspeed.geom
  FROM "fromTo_landuse" as landuse, "maxspeed_todoList" as maxspeed
  WHERE ST_Intersects(maxspeed.geom::geometry , ST_Expand(landuse.geom, 10000)::geometry);
