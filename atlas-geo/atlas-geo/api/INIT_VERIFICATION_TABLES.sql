CREATE TABLE IF NOT EXISTS public.{table_name} (
	osm_type varchar NOT NULL,
	osm_id bigint NOT NULL,
	verified_at timestamp NOT NULL,
	verified_by bigint NOT NULL,
	verified varchar NULL
);
