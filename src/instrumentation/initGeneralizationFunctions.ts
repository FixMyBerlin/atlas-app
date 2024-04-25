import {
  InteracitvityConfiguartion,
  TableId,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { generalizationFunctionIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/generalization/generalizationIdentifier'
import { prismaClientForRawQueries } from 'src/prisma-client'

async function createTileSpecification(tableName: TableId) {
  // Get column names and types
  const columnInformation = await prismaClientForRawQueries.$queryRawUnsafe(`
  SELECT jsonb_object_agg(column_name, udt_name) - 'geom' - 'minzoom' AS fields
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '${tableName}';`)
  const { fields } = columnInformation?.[0] // this object has the form {columnName: columnType}

  // Get the geometric extent
  const bbox = await prismaClientForRawQueries.$queryRawUnsafe(
    `SELECT Array[ST_XMIN(bbox), ST_YMIN(bbox), ST_XMAX(bbox), ST_YMAX(bbox)] as bounds
    from (
      SELECT ST_Transform(ST_SetSRID(ST_Extent(geom), 3857), 4326) AS bbox
        from "${tableName}"
      ) extent;`,
  )
  const { bounds } = bbox && bbox[0]
  // format as vector tile specifaction
  const tileSpecification = {
    vector_layers: [{ id: tableName, fields }],
    bounds,
  }
  return tileSpecification
}

function toSqlArray(arr: string[]) {
  return `Array[${arr.map((tag) => `'${tag}'`)}]::text[]`
}

export async function initGeneralizationFunctions(
  interacitvityConfiguartion: InteracitvityConfiguartion,
) {
  return Promise.all(
    Object.entries(interacitvityConfiguartion).map(
      async ([tableName, { minzoom, stylingKeys }]) => {
        const functionName = generalizationFunctionIdentifier(tableName as TableId)
        // Gather meta information for the tile specification
        const tileSpecification = await createTileSpecification(tableName as TableId)

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
            SELECT INTO mvt ST_AsMVT(tile, '${tableName}', 4096, 'geom') FROM (
              SELECT
                id,
                ST_AsMVTGeom(
                  ST_CurveToLine(
                    ST_Simplify(geom, tolerance, true)
                  ),
                  ST_TileEnvelope(z, x, y), 4096, 64, true) AS geom,
                CASE WHEN z >= ${minzoom} THEN tags ELSE jsonb_select(tags, ${toSqlArray(
                  stylingKeys,
                )}) END as tags,
                CASE WHEN z >= ${minzoom} THEN meta ELSE NULL END as meta
              FROM "${tableName}"
              WHERE (geom && ST_TileEnvelope(z, x, y))
              AND z >= minzoom
            ) AS tile;
            RETURN mvt;
          END
          $$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;`,
          ),
          prismaClientForRawQueries.$executeRawUnsafe(
            `COMMENT ON FUNCTION ${functionName} IS '${JSON.stringify(tileSpecification)}';`,
          ),
        ])
      },
    ),
  )
}
