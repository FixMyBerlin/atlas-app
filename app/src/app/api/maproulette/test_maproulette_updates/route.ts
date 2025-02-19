import { isProd } from '@/src/app/_components/utils/isEnv'
import { osmTypeIdString } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { geoDataClient } from '@/src/server/prisma-client'
import { feature, featureCollection, truncate } from '@turf/turf'
import { LineString } from 'geojson'
import { maprouletteTaskDescriptionMarkdown } from '../[projectKey]/_utils/taskMarkdown'

// About
// The goal of this test API endpoint is to test how MapRoulette behaves when given a set of data which is updated externally
// 1. create a maproulette challenge with 10 entries
// 2. edit 1 in OSM directly (only)
//    edit 1 in MapRoulette (only)
//    edit 1 in MapRoulette AND OSM directly
// 3. expected result: right away the number should be 8
// 4. refresh the campaign / trigger an update
// 5. expected result: ??? ideally MR will still show 10 items but 3 as resolved (including the external one)
// 6. add another entry here `885411183`
// 7. refresh the campaign / trigger an update
// 8. expected result: ??? ideally MR will now show 11 items, one more unresolved

// For testing:
// http://127.0.0.1:5173/api/maproulette/test_maproulette_updates
export async function GET() {
  const projectKey = 'needs_clarification'

  try {
    // SELECT DATA
    type QueryType = {
      type: string
      id: string
      kind: string
      geometry: LineString
    }[]

    const sqlWays = await geoDataClient.$queryRaw<QueryType>`
      SELECT
        bikelanes.osm_type as type,
        bikelanes.osm_id as id,
        bikelanes.tags->'category' AS kind,
        ST_AsGeoJSON(ST_Transform(bikelanes.geom, 4326))::jsonb AS geometry
      FROM public.bikelanes as bikelanes
      WHERE
        bikelanes.tags->>'todos' LIKE ${`* %${projectKey}%`}
        AND bikelanes.osm_id IN ('1308008000', '1308007994', '1219261223', '899453841', '1219263729', '1219298970', '1219298968', '1219302412', '1219233033', '899092559');
    `

    // ADD MAPROULETTE TASK DATA
    const features = sqlWays.map(({ type, id, kind, geometry }) => {
      const osmTypeId = osmTypeIdString(type, id)
      const text = maprouletteTaskDescriptionMarkdown({
        projectKey,
        osmTypeIdString: osmTypeId,
        kind,
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
    return Response.json(featureCollectionData)
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        error: 'Internal Server Error',
        info: isProd ? undefined : error,
      },
      { status: 500 },
    )
  }
}
