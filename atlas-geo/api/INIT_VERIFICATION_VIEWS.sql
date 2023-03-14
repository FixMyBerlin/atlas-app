DROP INDEX IF EXISTS {geometry_table}_osm_id_idx;
CREATE INDEX {geometry_table}_osm_id_idx ON {geometry_table} USING btree (osm_id);


CREATE TABLE IF NOT EXISTS {verification_table} (
	osm_type varchar NOT NULL,
  -- osm_type bpchar(1) NOT NULL,
	osm_id bigint NOT NULL,
	-- osm_id int8 NOT NULL,
	verified_at timestamp NOT NULL,
	verified_by bigint,
	verified varchar NULL,
  comment text
);
-- TODO: ALTER TABLE {verification_table} ALTER COLUMN osm_type TYPE bpchar(1) USING osm_type::bpchar;

DROP TABLE IF EXISTS {joined_table};
CREATE TABLE {joined_table} AS (
  SELECT g.osm_type, g.osm_id, g.category, g.tags, g.meta, g.geom, v.verified_at, v.verified_by, v.verified
  FROM {geometry_table} g
  LEFT JOIN (
    SELECT DISTINCT ON (v.osm_id) * FROM {verification_table} v ORDER BY v.osm_id, verified_at DESC
  ) v
  ON g.osm_id = v.osm_id
);
CREATE INDEX {joined_table}_geom_idx ON {joined_table} USING gist (geom) WITH (fillfactor='100');
CREATE INDEX {joined_table}_osm_id_idx ON {joined_table} USING btree (osm_id);

CREATE OR REPLACE FUNCTION atlas_update_{joined_table}() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN
  UPDATE {joined_table}
  SET verified_at = NEW.verified_at,
      verified_by = NEW.verified_by,
      verified = NEW.verified
  WHERE osm_id = NEW.osm_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS atlas_update_{joined_table} ON {verification_table};
CREATE TRIGGER atlas_update_{joined_table}
AFTER INSERT ON {verification_table}
FOR EACH ROW EXECUTE PROCEDURE atlas_update_{joined_table}();
