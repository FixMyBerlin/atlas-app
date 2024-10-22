import chalk from 'chalk'
import { TableId } from '../app/regionen/[regionSlug]/_mapData/mapDataSources/tables.const'
import { geoDataClient } from '../prisma-client'

const lengthCounterIdentifier = (id: TableId) =>
  `atlas_count_${id.toLowerCase()}_length` as `atlas_count_${Lowercase<TableId>}_length`
const segmentizedTableIdentifier = (id: TableId) =>
  `temp_${id.toLowerCase()}_segmentized` as `temp_${Lowercase<TableId>}_segmentized`

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
  const bikelanesSegmentizedPromise = geoDataClient.$executeRaw`
    CREATE TABLE IF NOT EXISTS temp_bikelanes_segmentized AS
      SELECT
        id,
        tags->>'category' AS aggregator_key,
        CASE
          WHEN tags->>'oneway' = 'yes' THEN 1
          WHEN tags->>'oneway' = 'implicit_yes' THEN 1
          ELSE 2
        END AS factor,
        (atlas_segmentize_linestring(geom, (tags->>'length')::FLOAT, 100)).*
      FROM
        bikelanes;`.then(() => {
    geoDataClient.$executeRaw`
    CREATE INDEX IF NOT EXISTS "temp_bikelanes_segmentized_geom_idx" ON temp_bikelanes_segmentized USING gist(geom);`
    geoDataClient.$executeRaw`
    CREATE INDEX IF NOT EXISTS "temp_bikelanes_segmentized_aggregator_idx" ON temp_bikelanes_segmentized (aggregator_key);`
  })

  const roadsSegmentizedPromiset = geoDataClient.$executeRaw`
    CREATE TABLE IF NOT EXISTS temp_roads_segmentized AS
      SELECT
        id,
        tags->>'road' AS aggregator_key,
        CASE
          WHEN tags->>'road_oneway' = 'yes_dual_carriageway' THEN 1
          ELSE 2
        END AS factor,
        (atlas_segmentize_linestring(geom, (tags->>'length')::FLOAT, 100)).*
      FROM
        roads;`.then(() => {
    geoDataClient.$executeRaw`
    CREATE INDEX IF NOT EXISTS "temp_roads_segmentized_geom_idx" ON temp_roads_segmentized USING gist(geom);`
    geoDataClient.$executeRaw`
    CREATE INDEX IF NOT EXISTS "temp_roads_segmentized_aggregator_idx" ON temp_bikelanes_segmentized (aggregator_key);`
  })

  const counterPromises = ['roads', 'bikelanes'].map((id: TableId) => {
    return geoDataClient.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION ${lengthCounterIdentifier(id)}(input_polygon Geometry(MultiPolygon, 3857))
      RETURNS JSONB AS $$
      DECLARE
        aggregated_length JSONB;
      BEGIN
        SELECT
          jsonb_object_agg(aggregator_key, ROUND(total_length_km / 1000.0))
        INTO aggregated_length
        FROM (
          SELECT
            segmentized.aggregator_key,
            SUM(segmentized.length * segmentized.factor) AS total_length_km
          FROM
            ${segmentizedTableIdentifier(id)} as segmentized
          WHERE
            ST_Intersects(segmentized.geom, input_polygon)
          GROUP BY
            segmentized.aggregator_key
        ) AS aggregated_data;

        RETURN aggregated_length;
      END;
      $$ LANGUAGE plpgsql;
  `)
  })
  return Promise.all([
    segmentizeLinestringPromise,
    bikelanesSegmentizedPromise,
    roadsSegmentizedPromiset,
    ...counterPromises,
  ])
}
export async function runAnalysis() {
  await geoDataClient.$connect()
  console.log(chalk.bold(chalk.white(' ○')), `Running Analysis`)
  await registerCustomFunctions()
  await geoDataClient.$executeRaw`
    CREATE TABLE IF NOT EXISTS "aggregatedLengths"
    (
      id TEXT UNIQUE,
      name TEXT,
      geom Geometry(MultiPolygon, 3857),
      bikelane_length JSONB,
      road_length JSONB
    );
    `
  return geoDataClient.$transaction([
    geoDataClient.$executeRaw`
      INSERT INTO "aggregatedLengths" (id, name,  geom, bikelane_length, road_length)
      SELECT
        id,
        tags->>'name',
        geom,
        atlas_count_bikelanes_length(geom),
        atlas_count_roads_length(geom)
      FROM "boundaries"
      WHERE (tags->>'admin_level')::TEXT = '4'
      ON CONFLICT (id)
        DO UPDATE SET
          bikelane_length = EXCLUDED.bikelane_length,
          road_length = EXCLUDED.road_length;
  `,
    geoDataClient.$executeRaw`
      DROP INDEX IF EXISTS "aggregatedLengths_geom_idx";
  `,
    geoDataClient.$executeRaw`
      CREATE INDEX "aggregatedLengths_geom_idx" ON "aggregatedLengths" USING gist(geom);
  `,
  ])
}
