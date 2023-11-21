-- STEP 1: create a function containing for "quantizing" LineStrings into homogenous parts of length  `res` +/- 25% (Note: segments shorter than `res` keep their length)
CREATE OR REPLACE FUNCTION QuantizeLineString(ls Geometry(LineString), res numeric)
    RETURNS TABLE(
        len numeric,
        geom Geometry(point)
    )
    AS $$
DECLARE
    len numeric := st_length(ls);
    n int := greatest(round(len / res), 1)::int;
BEGIN
    RETURN query
    SELECT
        len / n,
        ST_LineInterpolatePoint(ls,(generate_series(1, n) - 0.5) / n::numeric) AS geom;
END;
$$
LANGUAGE plpgsql;

-- create a Table conatining osm_id and tags for all quantized bikelanes geometries
CREATE temp TABLE _bikelanes_splitted AS
SELECT
    osm_id,
    tags,
(QuantizeLineString(geom, 100)).* AS geom
FROM
    bikelanes
    -- create a geospatial index on `_bikelanes_splitted` to speed up the spatial join;
    CREATE INDEX "_bikelanes_stats_geom_idx" ON _bikelanes_splitted USING gist(geom);

-- STEP 2: calculate the distribution of our `category` for each area of the `boundary` data set
-- make `osm_id` the primary of the `boundaries` table to allow selecting non-group-by columns
ALTER TABLE boundaries
    DROP CONSTRAINT IF EXISTS osm_id_key;

ALTER TABLE boundaries
    ADD CONSTRAINT osm_id_key PRIMARY KEY (osm_id);

-- spatialy join `_bikelanes_splitted` with `boundaries` then group by category and boundaries.osm_id aggreagate the results in a single json object per area
CREATE TABLE boundary_stats AS
SELECT
    osm_id,
    geom,
    region,
    jsonb_object_agg(category, len)
FROM (
    SELECT
        boundaries.osm_id AS osm_id,
        boundaries.geom AS geom,
        boundaries.tags ->> 'name' AS region,
        _bikelanes_splitted.tags ->> 'category' AS category,
        sum(_bikelanes_splitted.len) AS len
    FROM
        boundaries
        JOIN _bikelanes_splitted ON ST_Intersects(boundaries.geom, _bikelanes_splitted.geom)
    GROUP BY
        boundaries.osm_id,
        _bikelanes_splitted.tags ->> 'category') AS sq
GROUP BY
    osm_id,
    geom,
    region;

DROP TABLE _bikelanes_splitted;

-- this line is only for making pg_tileserve display the table
SELECT
    UpdateGeometrySRID('boundary_stats', 'geom', 3857);

