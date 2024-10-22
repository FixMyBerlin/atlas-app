import chalk from 'chalk'
import { geoDataClient } from '../prisma-client'

async function registerCustomFunctions() {
  const segmentizeLinestringPromise = geoDataClient.$executeRaw`
    CREATE OR REPLACE FUNCTION atlas_segmentize_linestring(input_geom Geometry(LineString), input_length FLOAT, res INT)
    RETURNS TABLE(
      length FLOAT,
      geom Geometry(point)
    )
    AS $$
    DECLARE
      n INT := greatest(round(input_length / res), 1)::INT;
    BEGIN
      RETURN query
      SELECT
        input_length / n as length,
        ST_SetSRID
        (
          ST_LineInterpolatePoint(input_geom, (generate_series(1, n) - 0.5) / n),
          ST_SRID(input_geom)
        ) AS geom;
    END;
    $$
    LANGUAGE plpgsql;
  `
  const countCategoryLengthsPromise = geoDataClient.$executeRaw`
    CREATE OR REPLACE FUNCTION atlas_count_category_lengths(input_polygon Geometry(MultiPolygon, 3857))
    RETURNS JSONB AS $$
    DECLARE
      category_length JSONB;
    BEGIN
        -- create a temporary table which holds all bikelanes cutted into points with their respective length
      BEGIN
        CREATE temp TABLE temp_bikelanes_segmentized AS
          SELECT
            id,
            tags->>'category' AS category,
            CASE
              WHEN tags->>'oneway' = 'yes' THEN 1
              WHEN tags->>'oneway' = 'implicit_yes' THEN 1
              ELSE 2
            END AS factor,
            (atlas_segmentize_linestring(geom, (tags->>'length')::FLOAT, 100)).*
          FROM
            bikelanes;
        CREATE INDEX "temp_bikelanes_segmentized_geom_idx" ON temp_bikelanes_segmentized USING gist(geom);
        CREATE INDEX "temp_bikelanes_segmentized_category_idx" ON temp_bikelanes_segmentized (category);
      EXCEPTION
        WHEN duplicate_table THEN
          -- If the table already exists, do nothing
          RAISE NOTICE 'Using cached "temp_bikelanes_segmentized" table';
      END;

      SELECT
        jsonb_object_agg(category, ROUND(total_length_km / 1000.0))
      INTO category_length
      FROM (
        SELECT
          category,
          SUM(bikelanes.length * bikelanes.factor) AS total_length_km
        FROM
          temp_bikelanes_segmentized as bikelanes
        WHERE
          ST_Intersects(bikelanes.geom, input_polygon)  -- Spatial intersection with input polygon
        GROUP BY
          category
      ) AS aggregated_data;

      RETURN category_length;
    END;
    $$ LANGUAGE plpgsql;
  `

  const countStreetLengthsPromise = geoDataClient.$executeRaw`
  CREATE OR REPLACE FUNCTION atlas_count_street_lengths(input_polygon Geometry(MultiPolygon, 3857))
  RETURNS FLOAT AS $$
  DECLARE
    street_length FLOAT;
  BEGIN
      -- create a temporary table which holds all bikelanes cutted into points with their respective length
    BEGIN
      CREATE temp TABLE temp_roads_segmentized AS
        SELECT
          id,
          CASE
            WHEN tags->>'road_oneway' = 'yes_dual_carriageway' THEN 1
            ELSE 2
          END AS factor,
          (atlas_segmentize_linestring(geom, (tags->>'length')::FLOAT, 100)).*
        FROM
          roads;
      CREATE INDEX "temp_roads_segmentized_geom_idx" ON temp_roads_segmentized USING gist(geom);
    EXCEPTION
      WHEN duplicate_table THEN
        -- If the table already exists, do nothing
        RAISE NOTICE 'Using cached "temp_roads_segmentized" table';
    END;

    SELECT
      ROUND(SUM(effective_length) / 1000.0)
    INTO street_length
    FROM (
      SELECT
        roads.length * roads.factor as effective_length
      FROM
        temp_roads_segmentized as roads
      WHERE
        ST_Intersects(roads.geom, input_polygon)  -- Spatial intersection with input polygon
    ) AS corrected_data;

    RETURN street_length;
  END;
  $$ LANGUAGE plpgsql;
`
  return Promise.all([
    segmentizeLinestringPromise,
    countCategoryLengthsPromise,
    countStreetLengthsPromise,
  ])
}
export async function runAnalysis() {
  console.log(chalk.bold(chalk.white(' ○')), `Running Analysis`)
  await registerCustomFunctions()
  await geoDataClient.$executeRaw`
    CREATE TABLE IF NOT EXISTS "bikelaneCategoryLengths"
    (
      id TEXT UNIQUE,
      name TEXT,
      category_length JSONB,
      street_length FLOAT,
      geom Geometry(MultiPolygon, 3857)
    );
    `
  return geoDataClient.$transaction([
    geoDataClient.$executeRaw`
    INSERT INTO "bikelaneCategoryLengths" (id, name, category_length, street_length, geom)
    SELECT id, tags->>'name', atlas_count_category_lengths(geom), atlas_count_street_lengths(geom), geom
      FROM "boundaries"
      WHERE (tags->>'admin_level')::TEXT = '4'
      ON CONFLICT (id)
      DO UPDATE SET category_length = EXCLUDED.category_length;
  `,
    geoDataClient.$executeRaw`
      DROP INDEX IF EXISTS "bikelaneCategoryLengths_geom_idx";
  `,
    geoDataClient.$executeRaw`
      CREATE INDEX "bikelaneCategoryLengths_geom_idx" ON "bikelaneCategoryLengths" USING gist(geom);
  `,
  ])
}
