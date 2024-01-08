import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { isProd } from 'src/app/_components/utils/isEnv'
import { prismaClientForRawQueries } from 'src/prisma-client'
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
    // const ids = params.ids.map(String).join(', ')
    const { ids } = params
    // console.log(ids)
    await prismaClientForRawQueries.$queryRaw`SET search_path TO public`
    const result = await prismaClientForRawQueries.$queryRaw`
      SELECT count(osm_id)::int as "nHits" FROM boundaries WHERE osm_id IN (${Prisma.join(ids)})`
    // @ts-ignore
    const { nHits } = result[0]
    if (nHits !== ids.length) {
      res.status(404).send("Couldn't find given ids. At least one id is wrong or dupplicated.")
    }
    const boundary = await prismaClientForRawQueries.$queryRaw`
      SELECT ST_AsGeoJSON(ST_Transform(ST_UNION(geom), 4326))::jsonb AS geom 
      FROM boundaries WHERE osm_id IN (${Prisma.join(ids)})`
    res.setHeader('Content-Disposition', `attachment; filename="boundary.geojson"`)
    // @ts-ignore
    res.json(boundary[0]['geom'])
  } catch (e) {
    if (!isProd) throw e
    res.status(500).send('Internal Server Error')
  }
}
