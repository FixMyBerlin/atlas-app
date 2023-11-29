-- this function quantizes `LineStrings` into `Points` where each point represents a homogenous segment each of length  `res` +/- 25% (Note: segments shorter than `res` keep their length)
CREATE OR REPLACE FUNCTION atlas_QuantizeLineString(ls Geometry(LineString), res numeric)
    RETURNS TABLE(
        len numeric,
        geom Geometry(point)
    )
    AS $$
DECLARE
    len numeric := st_length(ST_Transform(ls, 25833));
    n int := greatest(round(len / res), 1)::int;
BEGIN
    RETURN query
    SELECT
        len / n,
        ST_LineInterpolatePoint(ls,(generate_series(1, n) - 0.5) / n::numeric) AS geom;
END;
$$
LANGUAGE plpgsql;

-- STEP 1: quantize bikelane data into points
CREATE temp TABLE _bikelanesQuantized AS
SELECT
    osm_id,
    tags,
(atlas_QuantizeLineString(geom, 100)).* AS geom
FROM
    bikelanes;

-- create a geospatial index on `_bikelanesQuantized` to speed up the spatial join;
CREATE INDEX "_bikelanes_stats_geom_idx" ON _bikelanesQuantized USING gist(geom);

-- STEP 2: calculate the distribution of our `category` for each area of the `boundary` data set
-- make `osm_id` the primary of the `boundaries` table to allow selecting non-group-by columns
ALTER TABLE boundaries
    DROP CONSTRAINT IF EXISTS osm_id_key;

ALTER TABLE boundaries
    ADD CONSTRAINT osm_id_key PRIMARY KEY (osm_id);

-- spatialy join `_bikelanesQuantized` with `boundaries` then group by category and boundaries.osm_id aggreagate the results in a single json object per area
DROP TABLE IF EXISTS "boundaryStats";

CREATE TABLE "boundaryStats" AS
SELECT
    osm_id,
    geom,
    region,
    jsonb_object_agg(CONCAT(category, '_km'), len) AS bikelanes_category
FROM (
    SELECT
        boundaries.osm_id AS osm_id,
        boundaries.geom AS geom,
        boundaries.tags ->> 'name' AS region,
        _bikelanesQuantized.tags ->> 'category' AS category,
        round(sum(_bikelanesQuantized.len) / 1000, 1) AS len
    FROM
        boundaries
        JOIN _bikelanesQuantized ON ST_Intersects(boundaries.geom, _bikelanesQuantized.geom)
    WHERE
        -- Docs https://wiki.openstreetmap.org/wiki/DE:Grenze#Innerstaatliche_Grenzen
        (boundaries.tags ->> 'admin_level')::int IN (4, 6, 7, 8)
GROUP BY
    boundaries.osm_id,
    _bikelanesQuantized.tags ->> 'category') AS sq
GROUP BY
    osm_id,
    geom,
    region;

DROP TABLE _bikelanesQuantized;

-- this line is only for making pg_tileserve display the table
SELECT
    UpdateGeometrySRID('boundaryStats', 'geom', 3857);

-- -- for `jsonb` with numeric values return a normalized object (all values sum to 100) which also includes the total value
-- CREATE OR REPLACE FUNCTION atlas_NormalizeDistribution(dist jsonb)
--     RETURNS jsonb
--     AS $$
-- DECLARE
--     total numeric := sum(value)
-- FROM (
--     SELECT
--         (jsonb_each(dist)).value::numeric) AS sq;
-- BEGIN
--     RETURN jsonb_object_agg(key, round((100 * value::numeric) / total, 2)) || jsonb_build_object('total', total)
-- FROM (
--     SELECT
--         (jsonb_each(dist)).*) AS sq;
-- END;
-- $$
-- LANGUAGE plpgsql;
