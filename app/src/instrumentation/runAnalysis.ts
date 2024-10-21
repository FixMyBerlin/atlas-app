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
        ST_LineInterpolatePoint(input_geom, (generate_series(1, n) - 0.5) / n) AS geom;
    END;
    $$
    LANGUAGE plpgsql;
  `
  const countCategoryLengthsPromise = geoDataClient.$executeRaw`
    CREATE OR REPLACE FUNCTION atlas_count_category_lengths(input_polygon GEOMETRY)
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
          SUM(bikelanes.length) AS total_length_km
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
  return Promise.all([segmentizeLinestringPromise, countCategoryLengthsPromise])
}
export async function runAnalysis() {
  console.log(chalk.bold(chalk.white(' ○')), `Running Analysis`)
  await registerCustomFunctions()
  await geoDataClient.$executeRaw`
    CREATE TABLE IF NOT EXISTS "bikelaneCategoryLengths"
    (
      id TEXT UNIQUE,
      name TEXT,
      category_length JSONB
    );
    `
  return geoDataClient.$executeRaw`
    INSERT INTO "bikelaneCategoryLengths" (id, name, category_length)
    SELECT id, tags->>'name', atlas_count_category_lengths(geom)
      FROM "boundaries"
      WHERE (tags->>'admin_level')::TEXT = '4'
      ON CONFLICT (id)
      DO UPDATE SET category_length = EXCLUDED.category_length;
  `
}
