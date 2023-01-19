  -- SQL:
  -- für alle linien die kein maxpseed haben (auch nicht über die source-tags)
  --  wir nehmen die landuse=residential+industrial+commerical+retail
  --  buffer von ~10m um die fläche
  --  dann alle linien die (TODO) vollständig / am meisten / … in der fläche fläche sind
  --  (tendentizell dafür nicht schneiden, weil wir am liebsten die OSM ways so haben wie in OSM)
  --  und dann können wir in sql "maxspeed" "maxspeed_source='infereed from landuse'"
  --  UND dann auch einen "_todo="add 'maxspeed:source=DE:urban' to way"
  -- hinweis: außerstädtisch extrapolieren wir aber keine daten, da zu wenig "richtig"

-- DELETE * FROM "maxspeed_transformed";
INSERT INTO "maxspeed_transformed"
  SELECT   maxspeed.osm_type, maxspeed.osm_id, maxspeed.category, maxspeed.tags, maxspeed.meta, maxspeed.geom
  FROM "fromTo_landuse" as landuse, "maxspeed_todoList" as maxspeed
  WHERE ST_Intersects(maxspeed.geom::geometry , ST_Expand(landuse.geom, 10)::geometry);

-- UPDATE "maxspeed_transformed" SET "_maxspeed_source" = 'infereed from landuse';

update "maxspeed_transformed"  
set  tags = jsonb_set(tags, '{_maxspeed_source}','"infereed from landuse"');

update "maxspeed_transformed"  
set  tags = jsonb_insert(tags, '{maxspeed}','"add maxspeed:source=DE:urban to way"');

