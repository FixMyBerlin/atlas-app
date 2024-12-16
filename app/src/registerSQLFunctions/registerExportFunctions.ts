import {
  exportApiIdentifier,
  exportFunctionIdentifier,
} from '@/src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { geoDataClient } from '@/src/prisma-client'

// specify license and attribution for data export
// const license = "'ODbL 1.0, https://opendatacommons.org/licenses/odbl/'"
// const attribution = "'OpenStreetMap, https://www.openstreetmap.org/copyright; Radverkehrsatlas.de'"

export async function registerExportFunctions(tables: typeof exportApiIdentifier) {
  return Promise.all(
    tables.map(async (tableName) => {
      const functionName = exportFunctionIdentifier(tableName)
      const tagKeyQuery: Array<{ key: string }> = await geoDataClient.$queryRawUnsafe(`
        SELECT DISTINCT jsonb_object_keys(tags) AS key
        FROM "${tableName}"
      `)
      const metaKeyQuery: Array<{ key: string }> = await geoDataClient.$queryRawUnsafe(`
        SELECT DISTINCT jsonb_object_keys(meta) AS key
        FROM "${tableName}"
      `)
      const tagKeys = tagKeyQuery.map(({ key }) => `tags->>'${key}' as "${key}"`).join(',')
      const metaKeys = metaKeyQuery.map(({ key }) => `meta->>'${key}' as "${key}"`).join(',')

      if (!tagKeys || !metaKeys) {
        console.error(
          'Failed to `registerExportFunctions` because required tagKeys and metaKeys are empty',
          { functionName, tagKeyQuery, metaKeyQuery },
        )
      }

      return geoDataClient.$transaction([
        geoDataClient.$executeRawUnsafe(`
          DROP FUNCTION IF EXISTS public."${functionName}"(region Geometry(Polygon));
        `),
        geoDataClient.$executeRawUnsafe(`
          CREATE FUNCTION public."${functionName}"(region Geometry(Polygon))
          RETURNS BYTEA
          LANGUAGE plpgsql
          AS $$
          DECLARE
          fgb BYTEA;
          BEGIN
          SELECT ST_AsFlatGeobuf(q, false, 'geom') INTO fgb FROM (
            SELECT st_transform(geom, 4326) AS geom,
              id,
              osm_id,
              osm_type::text,
              ${tagKeys},
              ${metaKeys}
            FROM "${tableName}"
            WHERE geom && ST_Transform(region, 3857) AND minzoom > -1
          ) q;
          RETURN fgb;
          END;
          $$;
        `),
      ])
    }),
  )
}
