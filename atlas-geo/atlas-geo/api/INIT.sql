
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
	    'properties', to_jsonb(inputs) - 'geom'
	  ) AS feature
	  FROM (
	    SELECT * from "fromTo_shopping" t
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;




CREATE OR REPLACE FUNCTION public.export_geojson_education(minlon double precision, minlat double precision, maxlon double precision, maxlat double precision)
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
	    'properties', to_jsonb(inputs) - 'geom'
	  ) AS feature
	  FROM (
	    SELECT * from "fromTo_education" t
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;


CREATE OR REPLACE FUNCTION public.export_geojson_publicTransport(minlon double precision, minlat double precision, maxlon double precision, maxlat double precision)
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
	    'properties', to_jsonb(inputs) - 'geom'
	  ) AS feature
	  FROM (
	    SELECT * from "fromTo_publicTransport" t
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;




CREATE OR REPLACE FUNCTION public.export_geojson_places(minlon double precision, minlat double precision, maxlon double precision, maxlat double precision)
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
	    'properties', to_jsonb(inputs) - 'geom'
	  ) AS feature
	  FROM (
	    SELECT * from "places" t
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;




CREATE OR REPLACE FUNCTION public.export_geojson_roadtypes(minlon double precision, minlat double precision, maxlon double precision, maxlat double precision)
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
	    'properties', to_jsonb(inputs) - 'geom'
	  ) AS feature
	  FROM (
	    SELECT * from "roadtypesOsm" t
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;




CREATE OR REPLACE FUNCTION public.export_geojson_landuse(minlon double precision, minlat double precision, maxlon double precision, maxlat double precision)
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
	    'properties', to_jsonb(inputs) - 'geom'
	  ) AS feature
	  FROM (
	    SELECT * from "fromTo_landuse" t
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;
