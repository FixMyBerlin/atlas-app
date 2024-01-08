import { exportFunctionIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { prismaClientForRawQueries } from 'src/prisma-client'

// specify license and attribution for data export
const license = "'ODbL 1.0, https://opendatacommons.org/licenses/odbl/'"
const attribution = "'OpenStreetMap, https://www.openstreetmap.org/copyright; Radverkehrsatlas.de'"

export async function initExportFunctions(tables) {
  return Promise.all(
    tables.map((tableName) => {
      const functionName = exportFunctionIdentifier(tableName.toLowerCase())

      return prismaClientForRawQueries.$transaction([
        prismaClientForRawQueries.$executeRaw`SET search_path TO public;`,
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE OR REPLACE FUNCTION public.${functionName}(region geometry)
          RETURNS json
          LANGUAGE sql
          AS $function$
          SELECT
          json_build_object(
            'type', 'FeatureCollection', 
            'license', ${license},
            'attribution', ${attribution}, 
            'features', json_agg(features.feature)
          )
          FROM(
              SELECT
              jsonb_build_object('type', 'Feature', 'geometry',
              ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
              -- Reminder: All tables that can be exported are required to have those exact columns
              'properties', jsonb_build_object('osm_id', inputs.osm_id) ||
                  jsonb_build_object('osm_type', inputs.osm_type) || inputs.meta ||
                  inputs.tags) AS feature
              FROM(
                  SELECT
                      *
                  FROM
                    "${tableName}"
                  WHERE
                      ST_Intersects(ST_Transform(geom, 4326), region)) inputs) features;

        $function$;`,
        ),
      ])
    }),
  )
}
