DROP INDEX IF EXISTS {geometry_table}_osm_id_idx;
CREATE INDEX {geometry_table}_osm_id_idx ON {geometry_table} USING btree (osm_id);


CREATE TABLE IF NOT EXISTS public.{verification_table} (
	osm_type varchar NOT NULL,
  -- osm_type bpchar(1) NOT NULL,
	osm_id bigint NOT NULL,
	-- osm_id int8 NOT NULL,
	verified_at timestamp NOT NULL,
	verified_by bigint,
	verified varchar NULL
);
-- ALTER TABLE public.lit_verification ALTER COLUMN osm_type TYPE bpchar(1) USING osm_type::bpchar;


DROP TABLE IF EXISTS {verification_table}_uniq CASCADE;


CREATE TABLE {verification_table}_uniq AS (
  SELECT DISTINCT ON (v.osm_id) *
  FROM {verification_table} v
  ORDER BY v.osm_id, verified_at DESC
);

ALTER TABLE {verification_table}_uniq ADD CONSTRAINT {verification_table}_uniq_osm_id_osm_type_uniq UNIQUE (osm_id, osm_type);
CREATE INDEX {verification_table}_uniq_osm_type_osm_id_idx ON {verification_table}_uniq USING btree (osm_id);


CREATE OR REPLACE FUNCTION upsert_{verification_table}_uniq() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN
  INSERT INTO {verification_table}_uniq (osm_type, osm_id, verified_at, verified_by, verified)
    VALUES(NEW.osm_type, NEW.osm_id, NEW.verified_at, NEW.verified_by, NEW.verified)
  ON CONFLICT (osm_type, osm_id) do
    UPDATE SET verified_at = NEW.verified_at, verified_by = NEW.verified_by, verified = NEW.verified;
  RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER upsert_{verification_table}_uniq AFTER
INSERT ON {verification_table}
FOR EACH ROW EXECUTE PROCEDURE upsert_{verification_table}_uniq();


DROP VIEW IF EXISTS {view_name};
CREATE VIEW {view_name} AS
SELECT v.osm_type, v.osm_id, v.verified_at, v.verified_by , v.verified, o.tags, o.geom
FROM {geometry_table} o
LEFT JOIN {verification_table}_uniq v
ON v.osm_id = o.osm_id;
--AND v.osm_type = o.osm_type;
