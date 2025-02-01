import { isProd } from '@/src/app/_components/utils/isEnv'
import { osmTypeIdString } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { geoDataClient } from '@/src/prisma-client'
import { bikelaneTodoIds } from '@/src/processingTypes/todoId.generated.const'
import { todoIds } from '@/src/processingTypes/todoIds.const'
import { feature, featureCollection, truncate } from '@turf/turf'
import { LineString } from 'geojson'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { maprouletteTaskDescriptionMarkdown } from './_utils/taskMarkdown'

const MaprouletteSchema = z.strictObject({ projectKey: z.enum(todoIds) })

// For testing:
// Germany http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244
export async function GET({ params }: { params: { projectKey: string } }) {
  const parsedParams = MaprouletteSchema.safeParse({
    projectKey: params.projectKey,
  })

  // VALIDATE PARAMS
  if (parsedParams.success === false) {
    return NextResponse.json({ error: 'Invalid input', ...parsedParams.error }, { status: 404 })
  }
  const { projectKey } = parsedParams.data

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
      FROM public.bikelanes as bikelanes
      WHERE
        bikelanes.tags->>'todos' LIKE ${`* %${projectKey}%`};
    `
      : await geoDataClient.$queryRaw<QueryType>`
      SELECT
        roads.osm_type as type,
        roads.osm_id as id,
        roads.tags->'road' AS kind,
        ST_AsGeoJSON(ST_Transform(roads.geom, 4326))::jsonb AS geometry
      FROM public.roads as roads
      WHERE
        roads.tags->>'todos' LIKE ${`* %${projectKey}%`};
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
      { error: 'Internal Server Error', info: isProd ? undefined : error },
      { status: 500 },
    )
  }
}
