-- https://gis.stackexchange.com/a/191446/194701
-- Hinweis, das " - 'geom'" brauchen wir nicht, weil wir direkt die "tags" ausgeben.
-- TODO: ABER, damit verlieren wir die Längenangaben. Die müssten wir noch hinzufügen.

SELECT jsonb_build_object(
  'type',     'FeatureCollection',
  'features', jsonb_agg(features.feature)
)
FROM (
SELECT json_build_object(
  'type',       'Feature',
  'id',         concat(osm_type, '/', osm_id),
  'geometry',   ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
  'properties', to_jsonb(inputs.tags)
  ) AS feature
  FROM (SELECT * FROM places) inputs) features;
