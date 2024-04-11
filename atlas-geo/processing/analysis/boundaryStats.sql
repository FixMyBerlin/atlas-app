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


-- presence stats:
-- STEP 1: Quantize linestrings into points corresponding to 100m segments
CREATE temp TABLE _roadsQuantized AS
SELECT
    osm_id,
    tags,
(atlas_QuantizeLineString(geom, 100)).* AS geom
FROM
    roads
   where tags?'bikelane_self';


-- STEP 2: prepare the data for a spatial join e.g. create a geomtric index and make `osm_id` the primary key
-- create a geospatial index on `_roadsQuantized` to speed up the spatial join;
CREATE INDEX "_roads_stats_geom_idx" ON _roadsQuantized USING gist(geom);

-- make `osm_id` the primary of the `presenceStats` to speed up group by
ALTER TABLE "presenceStats"
    DROP CONSTRAINT IF EXISTS presence_stats_key;

ALTER TABLE "presenceStats"
    ADD CONSTRAINT presence_stats_key PRIMARY KEY (osm_id);

-- STEP 3: calculate the distribution of our `presence` data for each area of the `boundary` data set
WITH stats AS (
    SELECT
        osm_id,
        jsonb_object_agg(CONCAT(category, '_km'), len) AS presence_categories
    FROM (
        SELECT
            boundary.osm_id AS osm_id,
            roads.tags ->> unnest(Array['bikelane_left', 'bikelane_right', 'bikelane_self']) AS category,
            round(sum(roads.len) / 1000, 1) AS len
        FROM
            "presenceStats" AS boundary
            JOIN _roadsQuantized AS roads ON ST_Intersects(boundary.geom, roads.geom)
        GROUP BY
            boundary.osm_id,
            roads.tags ->> unnest(Array['bikelane_left', 'bikelane_right', 'bikelane_self'])) AS sq
    GROUP BY
        osm_id)
UPDATE
    "presenceStats"
SET
    presence_categories = stats.presence_categories
FROM
    stats
WHERE
    "presenceStats".osm_id = stats.osm_id;


-- -- bikelane category stats:
-- -- STEP 1: quantize bikelane data into points
-- CREATE temp TABLE _bikelanesQuantized AS
-- SELECT
--     osm_id,
--     tags,
-- (atlas_QuantizeLineString(geom, 100)).* AS geom
-- FROM
--     bikelanes;

-- -- STEP 2: calculate the distribution of our `category` for each area of the `boundary` data set
-- -- create a geospatial index on `_bikelanesQuantized` to speed up the spatial join;
-- CREATE INDEX "_bikelanes_stats_geom_idx" ON _bikelanesQuantized USING gist(geom);

-- -- make `osm_id` the primary of the `bikelaneCategoryStats` to speed up group by
-- ALTER TABLE "bikelaneCategoryStats"
--     DROP CONSTRAINT IF EXISTS category_stats_key;

-- ALTER TABLE "bikelaneCategoryStats"
--     ADD CONSTRAINT category_stats_key PRIMARY KEY (osm_id);

-- -- spatialy join `_bikelanesQuantized` with `bikelaneCategoryStats` then group by category and bikelaneCategoryStats.osm_id to aggreagate the results in a single json object per area
-- WITH stats AS (
--     SELECT
--         osm_id,
--         jsonb_object_agg(CONCAT(category, '_km'), len) AS bikelane_categories
--     FROM (
--         SELECT
--             boundary.osm_id AS osm_id,
--             bikelane.tags ->> 'category' AS category,
--             round(sum(bikelane.len) / 1000, 1) AS len
--         FROM
--             "bikelaneCategoryStats" AS boundary
--             JOIN _bikelanesQuantized AS bikelane ON ST_Intersects(boundary.geom, bikelane.geom)
--         GROUP BY
--             boundary.osm_id,
--             bikelane.tags ->> 'category') AS sq
--     GROUP BY
--         osm_id)
-- UPDATE
--     "bikelaneCategoryStats"
-- SET
--     bikelane_categories = stats.bikelane_categories
-- FROM
--     stats
-- WHERE
--     "bikelaneCategoryStats".osm_id = stats.osm_id;

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
