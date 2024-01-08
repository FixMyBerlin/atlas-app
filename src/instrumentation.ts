import {
  exportApiIdentifier,
  exportFunctionIdentifier,
  verificationApiIdentifier,
  verificationTableIdentifier,
  verifiedTableIdentifier,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { prismaClientForRawQueries } from 'src/prisma-client'

/**
 * File is executed once when the server is started.
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * This file will setup our DB
 * 1. `await initExportFunctions(exportApiIdentifier)`
      Create the PostgreSQL functions that are used by the export API in `src/pages/api/export/[tableName].ts`
 * 1. `await initVerificationViews(verificationApiIdentifier)`
      Create the post commit hook, tables and indexes that are required for our verification feature.
*/

async function initVerificationViews(tables) {
  return Promise.all(
    tables.map((geometryTable) => {
      // TODO: share helper with export endpoint
      const verifiedTable = verifiedTableIdentifier(geometryTable)
      const verificationTable = verificationTableIdentifier[geometryTable]

      return prismaClientForRawQueries.$transaction([
        prismaClientForRawQueries.$executeRawUnsafe(
          `DROP INDEX IF EXISTS public.${geometryTable}_osm_id_idx;`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE INDEX ${geometryTable}_osm_id_idx ON public."${geometryTable}" USING btree(osm_id);`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `DROP TABLE IF EXISTS public.${verifiedTable};`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE TABLE public.${verifiedTable} AS (
            SELECT
              g.osm_type,
              g.osm_id,
              g.tags,
              g.meta,
              g.geom,
              v.verified_at,
              v.verified_by,
              v.verified
            FROM
              public.${geometryTable} g
            LEFT JOIN ( SELECT DISTINCT ON (v.osm_id)
              *
            FROM
              prisma."${verificationTable}" v
            ORDER BY
              v.osm_id, verified_at DESC) v ON g.osm_id = v.osm_id
          );`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE INDEX ${verifiedTable}_geom_idx ON public."${verifiedTable}" USING gist(geom) WITH (fillfactor = '100');`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE INDEX ${verifiedTable}_osm_id_idx ON public."${verifiedTable}" USING btree(osm_id);`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE OR REPLACE FUNCTION public.atlas_update_${verifiedTable}()
          RETURNS TRIGGER
          LANGUAGE PLPGSQL
          AS $$
          BEGIN
            UPDATE
              public.${verifiedTable}
            SET
              verified_at = NEW.verified_at,
              verified_by = NEW.verified_by,
              verified = NEW.verified
            WHERE
              osm_id = NEW.osm_id;
            RETURN NEW;
          END;
          $$;`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `DROP TRIGGER IF EXISTS atlas_update_${verifiedTable} ON prisma."${verificationTable}";`,
        ),
        prismaClientForRawQueries.$executeRawUnsafe(
          `CREATE TRIGGER atlas_update_${verifiedTable}
          AFTER INSERT ON prisma."${verificationTable}"
          FOR EACH ROW
          EXECUTE PROCEDURE public.atlas_update_${verifiedTable}();`,
        ),
      ])
    }),
  )
}

// specify license and attribution for data export
const license = "'ODbL 1.0, https://opendatacommons.org/licenses/odbl/'"
const attribution = "'OpenStreetMap, https://www.openstreetmap.org/copyright; Radverkehrsatlas.de'"

async function initExportFunctions(tables) {
  return Promise.all(
    tables.map((tableName) => {
      const functionName = exportFunctionIdentifier(tableName.toLowerCase())

      return prismaClientForRawQueries.$transaction([
        prismaClientForRawQueries.$executeRaw`SET search_path TO public;`,
        prismaClientForRawQueries.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION public.${functionName}(region geometry)
          RETURNS json
          LANGUAGE sql
          AS $function$
          SELECT
          json_build_object('type', 'FeatureCollection', 'license', ${license},
              'attribution', ${attribution}, 'features', json_agg(features.feature))
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

        $function$;`),
      ])
    }),
  )
}

export async function register() {
  await initVerificationViews(verificationApiIdentifier)
  await initExportFunctions(exportApiIdentifier)
}
