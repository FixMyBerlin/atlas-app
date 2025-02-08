import { isProd } from '@/src/app/_components/utils/isEnv'
import { osmTypeIdString } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { geoDataClient } from '@/src/prisma-client'
import { todoIds } from '@/src/processingTypes/todoIds.const'
import { feature, featureCollection, truncate } from '@turf/turf'
import { LineString } from 'geojson'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { maprouletteTaskDescriptionMarkdown } from './_utils/taskMarkdown'

const MaprouletteSchema = z.object({ projectKey: z.enum(todoIds) }).strict()

// For testing:
// Germany http://127.0.0.1:5173/api/maproulette/missing_traffic_sign_244
export async function GET(request: NextRequest, { params }: { params: { projectKey: string } }) {
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
      osm_type: string
      osm_id: string
      id: string
      priority: string
      kind: string
      geometry: LineString
    }[]

    // NOTE: `todos_lines.tags->>${projectKey}` will automatically be wrapped like `todos_lines.tags->>'foo'`
    // `ST_Transform` changes projection
    // `ST_Simplify` simplifies the geometry (number of nodes) https://postgis.net/docs/ST_Simplify.html
    // `ST_AsGeoJSON` with `6` will reduce the number of digits for the lat/lng values https://postgis.net/docs/ST_AsGeoJSON.html
    const sqlWays = await geoDataClient.$queryRaw<QueryType>`
      SELECT
        todos_lines.osm_type as osm_type,
        todos_lines.osm_id as osm_id,
        todos_lines.id as id,
        todos_lines.tags->>${projectKey} as priority,
        todos_lines.meta->'category' AS kind,
        ST_AsGeoJSON(
          ST_Simplify(
            ST_Transform(todos_lines.geom, 4326),
            0.75
          ),
          6
        )::jsonb AS geometry
      FROM public.todos_lines as todos_lines
      WHERE todos_lines.tags ? ${projectKey};
    `

    // ADD MAPROULETTE TASK DATA
    const features = sqlWays.map(({ osm_type, osm_id, id, priority, kind, geometry }) => {
      const osmTypeId = osmTypeIdString(osm_type, osm_id)
      const text = maprouletteTaskDescriptionMarkdown({
        projectKey,
        osmTypeIdString: osmTypeId,
        kind,
        geometry,
      })
      const properties = {
        // id: osmTypeId, // feature.properties.id is the OSM ID "way/123"
        priority,
        task_updated_at: new Date().toISOString(), // can be used in MapRoulette to see if/when data was fetched
        task_markdown: (text || 'MISSING').replaceAll('\n', ' \n'),
      }
      // Create feature and also shorten lat/lng values to 8 digits
      // feature.id is the unique ID for MapRoulette "way/40232717/cycleway/right"
      return truncate(feature(geometry, properties, { id }), { precision: 8 })
    })

    // RESPONSE
    const featureCollectionData = featureCollection(features)
    return Response.json(featureCollectionData)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Internal Server Error', info: isProd ? undefined : error },
      { status: 500 },
    )
  }
}
