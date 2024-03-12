import { generalizationFunctionIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { prismaClientForRawQueries } from 'src/prisma-client'
import { Prisma } from '@prisma/client'

// specify license and attribution for data export
export async function initGeneralizationFunctions(tables) {
  return Promise.all(
    tables.map(async (tableName) => {
      const functionName = generalizationFunctionIdentifier(tableName)
      // Gather meta information for the tile specification

      // Get column names and types
      const columnInformation = await prismaClientForRawQueries.$queryRawUnsafe(`
        SELECT jsonb_object_agg(column_name, udt_name) - 'geom' AS fields
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = '${tableName}';`)
      const { fields } = columnInformation && columnInformation[0]

      // Get the geometric extent
      const bbox = await prismaClientForRawQueries.$queryRawUnsafe(
        `SELECT ST_XMIN(bbox) AS xmin, ST_YMIN(bbox) AS ymin, ST_XMAX(bbox) AS xmax, ST_YMAX(bbox) AS ymax
          from (
            SELECT ST_Transform(ST_SetSRID(ST_Extent(geom), 3857), 4326) AS bbox
              from ${tableName}
            ) extent;`,
      )
      const { xmin, ymin, xmax, ymax } = bbox && bbox[0]
      // format as vector tile specifaction
      const tileSpecification = {
        vector_layers: [{ id: functionName, fields }],
        bounds: [xmin, ymin, xmax, ymax],
      }
      return prismaClientForRawQueries.$transaction([
        prismaClientForRawQueries.$executeRaw`SET search_path TO public;`,
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE OR REPLACE
          FUNCTION public.${functionName}(z integer, x integer, y integer)
          RETURNS bytea AS $$
          DECLARE
            mvt bytea;
          BEGIN
            SELECT INTO mvt ST_AsMVT(tile, '${functionName}', 4096, 'g') FROM (
              select
              *,
                ST_AsMVTGeom(
                    geom,
                    ST_TileEnvelope(z, x, y),
                    4096, 64, true) AS g
              FROM "${tableName}"
              WHERE (geom && ST_TileEnvelope(z, x, y)) and (not tags?'_minZoom' or z >= (tags->'_minZoom')::integer )
            ) AS tile WHERE geom IS NOT NULL;
            RETURN mvt;
          END
          $$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `COMMENT ON FUNCTION ${functionName} IS '${JSON.stringify(tileSpecification)}';`,
        ),
      ])
    }),
  )
}
