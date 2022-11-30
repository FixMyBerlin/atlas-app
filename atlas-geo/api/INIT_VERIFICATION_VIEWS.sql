CREATE TABLE IF NOT EXISTS public.{verification_table} (
	osm_type varchar NOT NULL,
  -- osm_type bpchar(1) NOT NULL,
	osm_id bigint NOT NULL,
	-- osm_id int8 NOT NULL,
	verified_at timestamp NOT NULL,
	verified_by bigint,
	verified varchar NULL
);

-- JOIN original data table with verification table
CREATE OR REPLACE VIEW {view_name} AS
SELECT DISTINCT ON (o.osm_id) o.osm_type, o.osm_id, v.verified_at, v.verified_by , v.verified, o.tags, o.geom
FROM {geometry_table} o
LEFT JOIN  {verification_table} v
ON v.osm_id = o.osm_id
AND v.osm_type = o.osm_type
ORDER BY o.osm_id, v.verified_at DESC;
