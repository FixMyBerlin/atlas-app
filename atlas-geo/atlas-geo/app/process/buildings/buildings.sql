CREATE TABLE buildings AS
WITH clustered_buildings AS (
    -- Cluster all intersecting buildings and filter out small buildings at the same time
    SELECT
        st_multi(st_unaryunion(cluster.geom)) AS geom
    FROM (
        SELECT
            unnest(st_clusterintersecting(geom)) AS geom
        FROM _buildings_temp
        WHERE ST_Area(geom) >= 100 -- Filter out small buildings (< 100 sqm)
    ) AS cluster
)
SELECT * FROM clustered_buildings;


-- Same index that osm2pgsql create on _buildings_temp
CREATE INDEX buildings_geom_idx ON buildings USING GIST (geom);
