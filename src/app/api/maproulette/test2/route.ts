import { Prisma } from '@prisma/client'
import * as turf from '@turf/turf'
import { LineString } from '@turf/turf'
import { NextRequest } from 'next/server'
import { isProd } from 'src/app/_components/utils/isEnv'
import {
  longOsmType,
  mapillaryUrl,
} from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { pointFromGeometry } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/pointFromGeometry'
import { prismaClientForRawQueries } from 'src/prisma-client'
import { z } from 'zod'
// import { maprouletteProjects } from './_utils/maprouletteProjects.const'
// import { taskDescriptionMarkdown } from './_utils/taskMarkdown'

const idType = z.coerce.bigint().positive()
const MaprouletteSchema = z.object({
  // projectKey: z.enum(maprouletteProjects),
  ids: z.union([z.array(idType), idType.transform((x) => [x])]),
})

export async function GET(
  request: NextRequest /*, { params }: { params: { projectKey: string } }*/,
) {
  let parsedParams: z.infer<typeof MaprouletteSchema>
  const searchParams = request.nextUrl.searchParams
  try {
    parsedParams = MaprouletteSchema.parse({
      ids: searchParams.getAll('ids'),
      // projectKey: params.projectKey,
    })
  } catch (e) {
    if (!isProd) throw e
    Response.status(400).send('Bad Request')
    return
  }

  const tagFixChallengeOperations: Record<string, any>[] = []

  try {
    // PREPARE
    const { ids } = parsedParams
    await prismaClientForRawQueries.$queryRaw`SET search_path TO public`

    // CHECK REGIONS (`ids` params)
    const nHits = await prismaClientForRawQueries.$executeRaw`
      SELECT osm_id FROM boundaries WHERE osm_id IN (${Prisma.join(ids)})`
    if (nHits !== ids.length) {
      Response.status(404).send("Couldn't find given ids. At least one id is wrong or dupplicated.")
      return
    }

    type QueryTpye = { type: string; id: string; geometry: LineString }[]
    const sqlWays = await prismaClientForRawQueries.$queryRaw<QueryTpye>`
      SELECT
        roads.osm_type as type,
        roads.osm_id as id,
        ST_AsGeoJSON(ST_Transform(roads.geom, 4326))::jsonb AS geometry
      FROM public.roads as roads,
        (
          SELECT ST_Union(boundaries.geom) as union_geom
          FROM public.boundaries as boundaries
          WHERE boundaries.osm_id IN (${Prisma.join(ids)})
        ) as subquery
      WHERE
        roads.tags->>'bikelane_left' = 'missing'
        AND roads.tags->>'bikelane_right' = 'missing'
        AND ST_intersects(subquery.union_geom, roads.geom);
    `

    const markdown = ({ id, type, geometry }) => {
      const [lng, lat] = pointFromGeometry(geometry)
      return `
## Kontext

TOOD

## Aufgabe

TODO

## Hilfsmittel

* [Mapillary-Link zu dieser Stelle](${mapillaryUrl(geometry, 3)})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${lat}/${lng})
* [OpenStreetMap](https://www.openstreetmap.org/${longOsmType[type]}/${id})
`
    }

    // ADD MAPROULETTE TASK DATA
    const features = sqlWays.map(({ type, id, geometry }) => {
      const idString = `${longOsmType[type]}/${id}`
      const properties = {
        id: idString,
        task_updated_at: new Date().toISOString(), // can be used in MapRoulette to see if/when data was fetched
        task_markdown: markdown({
          id,
          type,
          geometry,
        }).replaceAll('\n', ' \n'),
      }

      tagFixChallengeOperations.push({
        operationType: 'modifyElement',
        data: {
          id: idString,
          operations: [
            {
              operation: 'setTags',
              data: {
                'cycleway:both': 'no',
              },
            },
            {
              operation: 'setTags',
              data: {
                'cycleway:left': 'separate',
                'cycleway:right': 'separate',
              },
            },
            {
              operation: 'setTags',
              data: {
                'cycleway:left': 'no',
                'cycleway:right': 'separate',
              },
            },
            {
              operation: 'setTags',
              data: {
                'cycleway:left': 'separate',
                'cycleway:right': 'no',
              },
            },
            {
              operation: 'setTags',
              data: {
                'cycleway:left': 'track',
                'cycleway:right': 'no',
              },
            },
            {
              operation: 'setTags',
              data: {
                'cycleway:left': 'no',
                'cycleway:right': 'track',
              },
            },
          ],
        },
      })
      // Create feature and also shorten lat/lng values to 8 digits
      return turf.truncate(turf.feature(geometry, properties), { precision: 8 })
    })

    // RESPONSE
    const featureCollection = turf.featureCollection(features)
    const tagFixChallenge = {
      cooperativeWork: {
        meta: {
          version: 2, // must be format version `2`
          type: 1, // `1` for tag fix type
        },
        operations: tagFixChallengeOperations,
      },
    }
    featureCollection['cooperativeWork'] = tagFixChallenge.cooperativeWork

    return Response.json(featureCollection, {
      headers: {
        'Content-Disposition': `attachment; filename="maproulette.geojson"`,
      },
    })
  } catch (e) {
    if (!isProd) throw e
    return Response.status(500).send('Internal Server Error')
  }
}
