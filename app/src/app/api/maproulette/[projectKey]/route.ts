import { isProd } from '@/src/app/_components/utils/isEnv'
import { osmTypeIdString } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { geoDataClient } from '@/src/prisma-client'
import { bikelaneTodoIds, todoIds } from '@/src/processingTypes/todoId'
import { Prisma } from '@prisma/client'
import { feature, featureCollection, truncate } from '@turf/turf'
import { LineString } from 'geojson'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { maprouletteTaskDescriptionMarkdown } from './_utils/taskMarkdown'

const idType = z.coerce.number().positive()
const MaprouletteSchema = z
  .object({
    projectKey: z.enum(todoIds),
    ids: z.union([z.array(idType).min(1), idType.transform((x) => [x])]),
  })
  .strict()

// For testing:
// Brandenburg http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244?ids=62504
// Berlin http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244?ids=62422
// Germany http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244?ids=51477 https://www.openstreetmap.org/relation/51477
export async function GET(request: NextRequest, { params }: { params: { projectKey: string } }) {
  const rawSearchParams = request.nextUrl.searchParams
  const parsedParams = MaprouletteSchema.safeParse({
    ids: rawSearchParams.getAll('ids'),
    projectKey: params.projectKey,
  })

  // VALIDATE PARAMS
  if (parsedParams.success === false || parsedParams.data.ids.length === 0) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        info: '`?ids=62504&ids=62422` has to be an OSM Relation ID. Use https://hanshack.com/geotools/gimmegeodata/ to find IDs, but not all boundaries are present in atlas.',
        ...(parsedParams.success === false ? parsedParams.error : parsedParams.data),
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
    // SELECT DATA FROM `bikelanes` or `roads`
    type QueryType = {
      type: string
      id: string
      kind: string | undefined
      geometry: LineString
    }[]

    const sqlWays = bikelaneTodoIds.includes(projectKey)
      ? await geoDataClient.$queryRaw<QueryType>`
      SELECT
        bikelanes.osm_type as type,
        bikelanes.osm_id as id,
        bikelanes.tags->'category' AS kind,
        ST_AsGeoJSON(ST_Transform(bikelanes.geom, 4326))::jsonb AS geometry
      FROM public.bikelanes as bikelanes,
        (
          SELECT ST_Union(boundaries.geom) as union_geom
          FROM public.boundaries as boundaries
          WHERE boundaries.osm_id IN (${Prisma.join(ids)})
        ) as subquery
      WHERE
        bikelanes.tags->>'todos' LIKE ${`* %${projectKey}%`}
        AND ST_intersects(subquery.union_geom, bikelanes.geom);
    `
      : await geoDataClient.$queryRaw<QueryType>`
      SELECT
        roads.osm_type as type,
        roads.osm_id as id,
        roads.tags->'road' AS kind,
        ST_AsGeoJSON(ST_Transform(roads.geom, 4326))::jsonb AS geometry
      FROM public.roads as roads,
        (
          SELECT ST_Union(boundaries.geom) as union_geom
          FROM public.boundaries as boundaries
          WHERE boundaries.osm_id IN (${Prisma.join(ids)})
        ) as subquery
      WHERE
        roads.tags->>'todos' LIKE ${`* %${projectKey}%`}
        AND ST_intersects(subquery.union_geom, roads.geom);
    `

    // ADD MAPROULETTE TASK DATA
    const features = sqlWays.map(({ type, id, kind, geometry }) => {
      const osmTypeId = osmTypeIdString(type, id)
      const text = maprouletteTaskDescriptionMarkdown({
        projectKey,
        osmTypeIdString: osmTypeId,
        bikelaneCategory: kind,
        geometry,
      })
      const properties = {
        id: osmTypeId,
        task_updated_at: new Date().toISOString(), // can be used in MapRoulette to see if/when data was fetched
        task_markdown: (text || 'MISSING').replaceAll('\n', ' \n'),
      }
      // Create feature and also shorten lat/lng values to 8 digits
      return truncate(feature(geometry, properties), { precision: 8 })
    })

    // RESPONSE
    const featureCollectionData = featureCollection(features)
    return Response.json(featureCollectionData, {
      headers: {
        'Content-Disposition': `attachment; filename="maproulette_${projectKey}.geojson"`,
      },
    })
  } catch (error) {
    if (isProd) console.error(error)
    return Response.json(
      {
        error: 'Internal Server Error',
        info: isProd ? undefined : error,
      },
      { status: 500 },
    )
  }
}
