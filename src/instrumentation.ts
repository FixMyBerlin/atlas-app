import { exportApiIdentifier } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { prismaClientForRawQueries } from 'src/prisma-client'

export async function register() {
  await Promise.all(
    exportApiIdentifier.map((tableName) => {
      // TODO: share helper with export endpoint
      const functionName = 'atlas_export_geojson_' + tableName.toLowerCase()

      return prismaClientForRawQueries.$transaction([
        prismaClientForRawQueries.$executeRaw`SET search_path TO public, prisma;`,
        prismaClientForRawQueries.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION public.${functionName}(region geometry)
          RETURNS json
          LANGUAGE sql
          AS $function$
          SELECT
          json_build_object('type', 'FeatureCollection', 'license', 'ODbL 1.0, https://opendatacommons.org/licenses/odbl/',
              'attribution', 'OpenStreetMap, https://www.openstreetmap.org/copyright; Radverkehrsatlas.de', 'features', json_agg(features.feature))
          FROM(
              SELECT
              jsonb_build_object('type', 'Feature', 'geometry',
              ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
                      -- Reminder: All tables that can be exported are required to have a those columns
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

        $function$;`),
      ])
    }),
  )
}
