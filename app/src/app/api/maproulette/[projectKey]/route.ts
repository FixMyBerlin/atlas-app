import { Prisma } from '@prisma/client'
import { Sql } from '@prisma/client/runtime/library'
import * as turf from '@turf/turf'
import { LineString } from '@turf/turf'
import { NextRequest, NextResponse } from 'next/server'
import { isProd } from 'src/app/_components/utils/isEnv'
import { osmTypeIdString } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { geoDataClient } from 'src/prisma-client'
import { z } from 'zod'
import { maprouletteProjects } from './_utils/maprouletteProjects.const'
import { taskDescriptionMarkdown } from './_utils/taskMarkdown'

const idType = z.coerce.number().positive()
const MaprouletteSchema = z
  .object({
    projectKey: z.enum(maprouletteProjects),
    ids: z.union([z.array(idType).min(1), idType.transform((x) => [x])]),
  })
  .strict()

// For testing:
// Brandenburg http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244?ids=62504
// Berlin http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244?ids=62422
// Germany http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244?ids=51477 https://www.openstreetmap.org/relation/51477
export async function GET(request: NextRequest, { params }: { params: { projectKey: string } }) {
  const searchParams = request.nextUrl.searchParams
  const parsedParams = MaprouletteSchema.safeParse({
    ids: searchParams.getAll('ids'),
    projectKey: params.projectKey,
  })

  // VALIDATE PARAMS
  if (parsedParams.success === false || parsedParams.data.ids.length === 0) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        info: '`?ids=62504&ids=62422` has to be an OSM Relation ID. Use https://hanshack.com/geotools/gimmegeodata/ to find IDs, but not all boundaries are present in atlas.',
        ...parsedParams,
      },
      { status: 404 },
    )
  }
  const { projectKey, ids } = parsedParams.data

  // CHECK REGIONS (`ids` params)
  type NHitsType = { osm_id: number }[]
  const nHits = await geoDataClient.$queryRaw<NHitsType>`
    SELECT osm_id::integer FROM boundaries WHERE osm_id IN (${Prisma.join(ids)})`
  if (nHits.length !== ids.length) {
    return NextResponse.json(
      {
        error: 'Invalid Region IDs',
        message: 'The given region relation IDs could not be found or returned mismatched results.',
        inputIds: ids.map((id) => Number(id)),
        foundIds: nHits.map(({ osm_id }) => Number(osm_id)),
      },
      { status: 404 },
    )
  }

  try {
    // SELECT WAYS FROM DB
    const wherePart: Sql = (() => {
      switch (projectKey) {
        // Lookup: Category LIKE "*KEY"
        case 'adjoiningOrIsolated':
        case 'advisoryOrExclusive':
          return Prisma.sql`bikelanes.tags->>'category' LIKE ${`%${projectKey}`}`
        // Lookup: Category = KEY
        case 'needsClarification':
          return Prisma.sql`bikelanes.tags->>'category' = ${projectKey}`
        // Lookup: Todos = "*KEY*"
        case 'missing_traffic_sign_244':
        case 'missing_traffic_sign_vehicle_destination':
        case 'missing_acccess_tag_bicycle_road':
        case 'missing_traffic_sign':
          // Docs: The part that gets injected will be wrapped in `'`, so it has to include prefixes like the `%`.
          return Prisma.sql`bikelanes.tags->>'todos' LIKE ${`* %${projectKey}%`}`
      }
    })()

    type QueryTpye = { type: string; id: string; category: string; geometry: LineString }[]
    const sqlWays = await geoDataClient.$queryRaw<QueryTpye>`
      SELECT
        bikelanes.osm_type as type,
        bikelanes.osm_id as id,
        bikelanes.tags->'category' AS category,
        ST_AsGeoJSON(ST_Transform(bikelanes.geom, 4326))::jsonb AS geometry
      FROM public.bikelanes as bikelanes,
        (
          SELECT ST_Union(boundaries.geom) as union_geom
          FROM public.boundaries as boundaries
          WHERE boundaries.osm_id IN (${Prisma.join(ids)})
        ) as subquery
      WHERE
        ${wherePart}
        AND ST_intersects(subquery.union_geom, bikelanes.geom);
    `

    // ADD MAPROULETTE TASK DATA
    const features = sqlWays.map(({ type, id, category, geometry }) => {
      const osmTypeId = osmTypeIdString(type, id)
      const properties = {
        id: osmTypeId,
        category,
        task_updated_at: new Date().toISOString(), // can be used in MapRoulette to see if/when data was fetched
        task_markdown: taskDescriptionMarkdown({
          projectKey,
          osmTypeIdString: osmTypeId,
          category,
          geometry,
        }).replaceAll('\n', ' \n'),
      }
      // Create feature and also shorten lat/lng values to 8 digits
      return turf.truncate(turf.feature(geometry, properties), { precision: 8 })
    })

    // RESPONSE
    const featureCollection = turf.featureCollection(features)
    return Response.json(featureCollection, {
      headers: {
        'Content-Disposition': `attachment; filename="maproulette_${projectKey}.geojson"`,
      },
    })
  } catch (e) {
    if (!isProd) throw e
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
