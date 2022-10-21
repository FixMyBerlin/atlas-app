CREATE TABLE IF NOT EXISTS public.{table_name} (
	osm_type varchar NOT NULL,
	osm_id bigint NOT NULL,
	verified_at timestamp NOT NULL,
	verified_by bigint,
	verified varchar NULL
);

-- JOIN original data table with verification table
CREATE OR REPLACE VIEW {view_name} AS
SELECT o.osm_type, o.osm_id, v.verified_at, v.verified_by , v.verified, o.tags, o.geom FROM "{original_table}" o
JOIN  {table_name} v
ON v.osm_id = o.osm_id
AND v.osm_type = o.osm_type;
