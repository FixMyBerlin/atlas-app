import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prismaClientForRawQueries } from 'src/prisma-client'

import { isProd } from 'src/app/_components/utils/isEnv'
import { sources } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'

const exportEnabledSources = sources
  .filter((source) => source.export.enabled)
  .map((source) => source.export.apiIdentifier)

const ExportSchema = z.object({
  tableName: z.enum(exportEnabledSources),
  minlon: z.coerce.number().default(13.3),
  minlat: z.coerce.number().default(52.2),
  maxlon: z.coerce.number().default(13.7),
  maxlat: z.coerce.number().default(52.3),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let params
  try {
    params = ExportSchema.parse(req.query)
  } catch (e) {
    if (!isProd) throw e
    res.status(400).send('Bad Request')
    return
  }

  try {
    const { tableName, minlon, minlat, maxlon, maxlat } = params
    const functionName = 'atlas_export_geojson_' + tableName.toLowerCase()
    await prismaClientForRawQueries.$queryRawUnsafe('SET search_path TO public')
    const geoJson = await prismaClientForRawQueries.$queryRawUnsafe(
      `SELECT * FROM "${functionName}"
    (( SELECT * FROM ST_SetSRID(ST_MakeEnvelope(${minlon}, ${minlat}, ${maxlon}, ${maxlat}), 4326) ))`,
    )
    res.setHeader('Content-Disposition', `attachment; filename="${tableName}.geojson"`)
    res.json(geoJson)
  } catch (e) {
    if (!isProd) throw e
    res.status(500).send('Internal Server Error')
  }
}
