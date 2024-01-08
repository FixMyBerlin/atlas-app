import { NextApiRequest, NextApiResponse } from 'next'
import { isProd } from 'src/app/_components/utils/isEnv'
import {
  exportApiIdentifier,
  exportFunctionIdentifier,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { prismaClientForRawQueries } from 'src/prisma-client'
import { z } from 'zod'

const ExportSchema = z.object({
  tableName: z.enum(exportApiIdentifier),
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
    const functionName = exportFunctionIdentifier(tableName.toLowerCase())
    await prismaClientForRawQueries.$queryRaw`SET search_path TO public`
    const geoJson = await prismaClientForRawQueries.$queryRawUnsafe(
      `SELECT * FROM "${functionName}"
    (( SELECT * FROM ST_SetSRID(ST_MakeEnvelope(${minlon}, ${minlat}, ${maxlon}, ${maxlat}), 4326) ))`,
    )
    res.setHeader('Content-Disposition', `attachment; filename="${tableName}.geojson"`)
    // @ts-ignore
    res.json(geoJson[0][functionName])
  } catch (e) {
    if (!isProd) throw e
    res.status(500).send('Internal Server Error')
  }
}
