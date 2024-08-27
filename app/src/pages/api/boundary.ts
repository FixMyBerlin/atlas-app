import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { isProd } from 'src/app/_components/utils/isEnv'
import { geoDataClient } from 'src/prisma-client'
import { z } from 'zod'

const idType = z.coerce.bigint().positive()
const BoundarySchema = z.object({
  ids: z.union([z.array(idType), idType.transform((x) => [x])]),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let params
  try {
    params = BoundarySchema.parse(req.query)
  } catch (e) {
    if (!isProd) throw e
    res.status(400).send('Bad Request')
    return
  }

  try {
    const { ids } = params

    const nHits = await geoDataClient.$executeRaw`
      SELECT osm_id
      FROM boundaries
      WHERE osm_id IN (${Prisma.join(ids)})
    `
    if (nHits !== ids.length) {
      res.status(404).send("Couldn't find given ids. At least one id is wrong or dupplicated.")
      return
    }

    const boundary = await geoDataClient.$queryRaw<Record<'geom', object>[]>`
      SELECT ST_AsGeoJSON(ST_Transform(ST_UNION(geom), 4326))::jsonb AS geom
      FROM boundaries
      WHERE osm_id IN (${Prisma.join(ids)})
    `

    res.setHeader('Content-Disposition', `attachment; filename="boundary.geojson"`)
    res.json(boundary?.at(0)?.geom)
  } catch (e) {
    if (!isProd) throw e
    res.status(500).send('Internal Server Error')
  }
}
