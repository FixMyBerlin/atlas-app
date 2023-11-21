-- TODO: Wrap into table returning function and parametrize on `res`, `table` and `tag`
-- STEP 1: create a table containing the homogenously splitted lines as points
BEGIN;

-- for each segment which is longer than `res` calculate `n` which is rounded `len` / `res` 
CREATE temp TABLE _res ON COMMIT DROP AS
SELECT
    *,
    st_length(geom) AS len,
    greatest(round(st_length(geom) / 100), 1) :: int AS n
FROM
    bikelanes;

-- split those segments into `n` pieces with equal length `len` where `len` = `res` +/- `res`/4
CREATE temp TABLE _bikelanes_splitted AS
SELECT
    osm_id,
    tags,
    len / n AS len,
    ST_LineInterpolatePoint(
        geom,
        (generate_series(1, n) - 0.5) / n :: numeric
    ) AS geom
FROM
    _res;

COMMIT;

-- STEP 2: calculate the distribution of our `category` for each area of the `boundary` data set
-- 
-- create a geospatial index on `_bikelanes_splitted` to speed up the spatial join;
CREATE INDEX "_bikelanes_stats_geom_idx" ON _bikelanes_splitted USING gist (geom);

-- make `osm_id` the primary of the `boundaries` table to allow selecting non-group-by columns
ALTER TABLE
    boundaries DROP CONSTRAINT IF EXISTS osm_id_key;

ALTER TABLE
    boundaries
ADD
    CONSTRAINT osm_id_key PRIMARY KEY (osm_id);

-- spatialy join `_bikelanes_splitted` with `boundaries` then group by category and boundaries.osm_id aggreagate the results in a single json object per area
CREATE TABLE boundary_stats AS
SELECT
    osm_id,
    geom,
    region,
    jsonb_object_agg(category, len)
FROM
    (
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
            _bikelanes_splitted.tags ->> 'category'
    ) AS sq
GROUP BY
    osm_id,
    geom,
    region;

DROP TABLE _bikelanes_splitted;

-- this line is only for making pg_tileserve display the `_bikelanes_splitted` table (can be deleted later on)
SELECT
    UpdateGeometrySRID('boundary_stats', 'geom', 3857);