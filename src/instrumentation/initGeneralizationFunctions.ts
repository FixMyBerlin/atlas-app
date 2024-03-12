import { generalizationFunctionIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { prismaClientForRawQueries } from 'src/prisma-client'
import { Prisma } from '@prisma/client'

// specify license and attribution for data export
export async function initGeneralizationFunctions(tables) {
  return Promise.all(
    tables.map(async (tableName) => {
      const functionName = generalizationFunctionIdentifier(tableName)
      // Get table columns and types for vector tile specification (tile.json)
      const queryResults = await prismaClientForRawQueries.$queryRawUnsafe(`
        SELECT jsonb_object_agg(column_name, udt_name) - 'geom' as fields
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = '${tableName}';`)
      const { fields } = queryResults && queryResults[0]
      const vectorLayerDescriptions = { vector_layers: [{ id: functionName, fields }] }
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
            ) as tile WHERE geom IS NOT NULL;
            RETURN mvt;
          END
          $$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `COMMENT ON FUNCTION ${functionName} IS '${JSON.stringify(vectorLayerDescriptions)}';`,
        ),
      ])
    }),
  )
}
