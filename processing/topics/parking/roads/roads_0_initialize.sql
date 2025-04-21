-- ABOUT
-- Cut date per region and use a regional projection
--
-- NOTE: The table is initialized by osm2pgsql in parking.lua but nothing is added.
-- From source_germany, cut bbox for region bibi
-- bbox: {min: [9.0671, 48.9229],max: [9.1753, 48.9838],},
INSERT INTO
  public.parking_source_regions_roads
SELECT
  *
FROM
  public.parking_source_germany_roads
WHERE
  ST_Intersects (
    geom,
    ST_Transform (
      ST_MakeEnvelope (9.0671, 48.9229, 9.1753, 48.9838, 4326),
      5243
    )
  );

-- From source_germany, cut bbox for region berlin
-- bbox: {min: [13.2809, 52.46],max: [13.4929, 52.5528],},
INSERT INTO
  public.parking_source_regions_roads
SELECT
  *
FROM
  public.parking_source_germany_roads
WHERE
  ST_Intersects (
    geom,
    ST_Transform (
      ST_MakeEnvelope (13.2809, 52.46, 13.4929, 52.5528, 4326),
      5243
    )
  );

-- Copy the result into the table that we perform updates on
INSERT INTO
  public.parking_roads
SELECT
  *
FROM
  public.parking_source_regions_roads;
