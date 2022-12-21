-- ---------------------------
-- Add Length
-- Filter by Length
-- ---------------------------

-- Reminder: Whenever we move content to our `_excluded` Table, that table has to have the same structure (columns).
ALTER TABLE "roadClassification" ADD COLUMN IF NOT EXISTS length numeric;
ALTER TABLE "roadClassification_excluded" ADD COLUMN IF NOT EXISTS length numeric;

UPDATE "roadClassification" SET length = ROUND(ST_Length(geom)::numeric, 1);

-- TODO: _excludeNotes erzeugen
-- TODO: This seems to bee too hard; maybe we should make the _excludeNotes a regular column?
-- UPDATE "roadClassification" SET tags = jsonb_set(tags, '{_excludeNotes}', ';Exclude (SQL) `length<10`');

-- Lets only delete small segments of certain highway types which typically have small non-needed extensions.
INSERT INTO "roadClassification_excluded" (
  SELECT * FROM "roadClassification"
  WHERE "length" < 20
  AND tags ->> 'highway' IN ('path', 'track', 'footway', 'service')
);
DELETE FROM "roadClassification"
  WHERE "length" < 20
  AND tags ->> 'highway' IN ('path', 'track', 'footway', 'service');

-- ---------------------------
-- Filter by connection TODO
-- ---------------------------

-- ZIEL:
-- Alle Straßensegmente haben, die nur auf einer Seite (Start oder Endpunkt) zu einer anderen Straße haben. AKA Einfahrten.
-- Wenn Startpunkt ja, dann Ende nein
-- Wenn Ende ja, dann Start nein

DROP TABLE IF EXISTS "_roadClassification_buffer";

CREATE TABLE "_roadClassification_buffer" AS (
	SELECT
		r1.*
	FROM
		"roadClassification" AS r1,
		"roadClassification" AS r2
	WHERE
  (
    -- only those, where the start point buffer intersetcs with other ways (except for itself)
    -- OR the other way around
    -- AND only those, that are below 100~m, so long roads that end without connection are included
    (
      (ST_intersects(ST_buffer(ST_startpoint(r1.geom), 2), r2.geom) AND r1.osm_id <> r2.osm_id)
      AND NOT
      (ST_intersects(ST_buffer(ST_endpoint(r1.geom), 2), r2.geom) AND r1.osm_id <> r2.osm_id)
    ) OR (
      (ST_intersects(ST_buffer(ST_endpoint(r1.geom), 2), r2.geom) AND r1.osm_id <> r2.osm_id)
      AND NOT
      (ST_intersects(ST_buffer(ST_startpoint(r1.geom), 2), r2.geom) AND r1.osm_id <> r2.osm_id)
    )
  ) and r1.length < 100
)

-- TODO:
-- Erstmal Wege-Stücke verbinden (name+type), damit ein Weg, der zerstücket ist, nicht sein Ende verliert durch diese Funktion
-- WIE: Gruppieren nach name+Type, dann ST_union
