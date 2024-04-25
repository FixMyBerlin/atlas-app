import { Prisma } from '@prisma/client'
import * as turf from '@turf/turf'
import { LineString } from '@turf/turf'
import { NextRequest } from 'next/server'
import { isProd } from 'src/app/_components/utils/isEnv'
import { osmTypeIdString } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { prismaClientForRawQueries } from 'src/prisma-client'
import { z } from 'zod'
import { maprouletteProjects } from './_utils/maprouletteProjects.const'
import { taskDescriptionMarkdown } from './_utils/taskMarkdown'

const idType = z.coerce.bigint().positive()
const MaprouletteSchema = z.object({
  projectKey: z.enum(maprouletteProjects),
  ids: z.union([z.array(idType), idType.transform((x) => [x])]),
})

export async function GET(request: NextRequest, { params }: { params: { projectKey: string } }) {
  let parsedParams: z.infer<typeof MaprouletteSchema>
  const searchParams = request.nextUrl.searchParams
  try {
    parsedParams = MaprouletteSchema.parse({
      ids: searchParams.getAll('ids'),
      projectKey: params.projectKey,
    })
  } catch (e) {
    if (!isProd) throw e
    Response.status(400).send('Bad Request')
    return
  }

  try {
    // PREPARE
    const { projectKey, ids } = parsedParams
    await prismaClientForRawQueries.$queryRaw`SET search_path TO public`

    // CHECK REGIONS (`ids` params)
    const nHits = await prismaClientForRawQueries.$executeRaw`
      SELECT osm_id FROM boundaries WHERE osm_id IN (${Prisma.join(ids)})`
    if (nHits !== ids.length) {
      Response.status(404).send("Couldn't find given ids. At least one id is wrong or dupplicated.")
      return
    }

    // SELECT WAYS FROM DB
    const wherePart = (() => {
      switch (projectKey) {
        case 'adjoiningOrIsolated':
          return Prisma.sql`bikelanes.tags->>'category' LIKE '%adjoiningOrIsolated'`
        case 'advisoryOrExclusive':
          return Prisma.sql`bikelanes.tags->>'category' LIKE '%advisoryOrExclusive'`
        case 'needsClarification':
          return Prisma.sql`bikelanes.tags->>'category' = 'needsClarification'`
      }
    })()

    type QueryTpye = { type: string; id: string; category: string; geometry: LineString }[]
    const sqlWays = await prismaClientForRawQueries.$queryRaw<QueryTpye>`
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
      const properties = {
        id: `${osmTypeIdString(type, id)}`,
        category,
        task_updated_at: new Date().toISOString(), // can be used in MapRoulette to see if/when data was fetched
        task_markdown: taskDescriptionMarkdown({
          projectKey,
          id,
          type,
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
    return Response.status(500).send('Internal Server Error')
  }
}
