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
      const { fields } = columnInformation && columnInformation[0] // this object has the form {columnName: columnType}
      const columnNames = Object.keys(fields).join(', ')
      // Get the geometric extent
      const bbox = await prismaClientForRawQueries.$queryRawUnsafe(
        `SELECT Array[ST_XMIN(bbox),ST_YMIN(bbox),ST_XMAX(bbox),ST_YMAX(bbox)] as bounds
          from (
            SELECT ST_Transform(ST_SetSRID(ST_Extent(geom), 3857), 4326) AS bbox
              from ${tableName}
            ) extent;`,
      )
      const { bounds } = bbox && bbox[0]
      // format as vector tile specifaction
      const tileSpecification = {
        vector_layers: [{ id: functionName, fields }],
        bounds,
      }
      return prismaClientForRawQueries.$transaction([
        prismaClientForRawQueries.$executeRaw`SET search_path TO public;`,
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE OR REPLACE
          FUNCTION public.${functionName}(z integer, x integer, y integer)
          RETURNS bytea AS $$
          DECLARE
            mvt bytea;
            tolerance float;
          BEGIN
            IF z BETWEEN 6 AND 14 THEN
              tolerance = POWER(2, 14-z);
            ELSE
              tolerance = 0;
            END IF;
            SELECT INTO mvt ST_AsMVT(tile, '${functionName}', 4096, 'geom') FROM (
              select
              *,
                ST_AsMVTGeom(
                    ST_Simplify(geom, tolerance, true),
                    ST_TileEnvelope(z, x, y),
                    4096, 64, true) AS geom,
                  ${columnNames}
              FROM "${tableName}"
              WHERE (geom && ST_TileEnvelope(z, x, y))
                and (not tags?'_minzoom' or z >= (tags->'_minzoom')::integer)
                and (not tags?'_maxzoom' or z < (tags->'_maxzoom')::integer)
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
