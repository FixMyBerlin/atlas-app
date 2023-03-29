
CREATE OR REPLACE FUNCTION public.{func_name}(minlon double precision, minlat double precision, maxlon double precision, maxlat double precision)
 RETURNS json
 LANGUAGE sql
AS $function$
	SELECT json_build_object(
	    'type',         'FeatureCollection',
      'license',      'ODbL 1.0, https://opendatacommons.org/licenses/odbl/',
      'attribution',  'OpenStreetMap, https://www.openstreetmap.org/copyright; Radverkehrsatlas.de',
	    'features',     json_agg(features.feature)
	)
	FROM (
	  SELECT jsonb_build_object(
	    'type',       'Feature',
	    'geometry',   ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
      -- Reminder: All tables that can be exported are required to have a those columns
	    'properties', jsonb_build_object('osm_id', inputs.osm_id) || jsonb_build_object('osm_type', inputs.osm_type) || inputs.meta || inputs.tags
	  ) AS feature
	  FROM (
	    SELECT * from "{table_name}"
	    WHERE ST_Transform(geom, 4326) && ST_MakeEnvelope(minlon , minlat , maxlon , maxlat )
	  ) inputs
	) features;
$function$
;
