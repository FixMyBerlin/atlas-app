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
-- Thoughts to implement this:
-- filter landuse or places on type
-- project to euclidean
-- buffer that union by e.g. 10 m
-- make a union of the filter geometries
-- check intersections or inclusion for ways that lack maxspeed e.g. those in _maxspeed_missing
-- add these ways with a constant maxspeed and `present=false` into maxspeed table
SELECT ST_Transform(geom, 25833) from landuse where tags->>'landuse' = 'residential';

INSERT INTO "maxspeed_transformed"
  SELECT   maxspeed.*
  FROM "fromTo_landuse" as landuse, "_maxspeed_missing" as maxspeed
  WHERE ST_Intersects(maxspeed.geom::geometry , ST_Expand(landuse.geom, 10)::geometry);

-- UPDATE "maxspeed_transformed" SET "_maxspeed_source" = 'infereed from landuse';

update "maxspeed_transformed"
set  tags = jsonb_set(tags, '{_maxspeed_source}','"infereed from landuse"');

update "maxspeed_transformed"
set  tags = jsonb_insert(tags, '{maxspeed}','"add maxspeed:source=DE:urban to way"');

