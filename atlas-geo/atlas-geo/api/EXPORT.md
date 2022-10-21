# Useful PostgreSQL Functions and SQL Statements

## Function for creating GeoJSON FeatureCollections:
```postgresql
CREATE OR REPLACE FUNCTION public.export_geojson_shops(minlon double precision, minlat double precision, maxlon double precision, maxlat double precision)
 RETURNS json
 LANGUAGE sql
AS $function$
	SELECT json_build_object(
	    'type',     'FeatureCollection',
	    'features', json_agg(features.feature)
	)
	FROM (
	  SELECT jsonb_build_object(
	    'type',       'Feature',
	    'geometry',   ST_AsGeoJSON(ST_Transform(geom,4326))::jsonb,
	    'properties', inputs.tags
	  ) AS feature
	  FROM (
	    SELECT * from "fromTo_shopping" t
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;
```

## Easy GeoJSON FeatureCollection from PostGIS Docs
```postgresql
SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(t.*)::json)
)
FROM highways as t
WHERE t.geog && ST_MakeEnvelope(13.3 , 52.4 , 13.35 , 52.52 );
```

## Export GeoJSON with selected properties and correct SRID 4326

GeoJSON standard expects geometry in SRID 4326.

```postgresql
SELECT json_build_object(
    'type',     'FeatureCollection',
    'features', json_agg(features.feature)
)
FROM (
  SELECT jsonb_build_object(
    'type',       'Feature',
    'geometry',   ST_AsGeoJSON(ST_Transform(geom,4326))::jsonb,
    'properties', to_jsonb(inputs) - 'gid' - 'geom'
  ) AS feature
  FROM (
    SELECT * FROM highways t
    WHERE t.geog && ST_MakeEnvelope(13.3 , 52.4 , 13.35 , 52.52 )
  ) inputs
) features;
```
Problem: This also exports geog and geom in shorten form
