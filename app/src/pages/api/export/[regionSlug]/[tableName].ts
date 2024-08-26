import { getSession } from '@blitzjs/auth'
import db from 'db'
import { NextApiRequest, NextApiResponse } from 'next'
import { isProd } from 'src/app/_components/utils/isEnv'
import {
  exportApiIdentifier,
  exportFunctionIdentifier,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/export/exportIdentifier'
import { api } from 'src/blitz-server'
import { geoDataClient } from 'src/prisma-client'
import { z } from 'zod'

const ExportSchema = z.object({
  regionSlug: z.string(),
  tableName: z.enum(exportApiIdentifier),
  apiKey: z.string().optional(),
  minlon: z.coerce.number().default(13.3),
  minlat: z.coerce.number().default(52.2),
  maxlon: z.coerce.number().default(13.7),
  maxlat: z.coerce.number().default(52.3),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let params: z.infer<typeof ExportSchema>
  try {
    params = ExportSchema.parse(req.query)
  } catch (e) {
    if (!isProd) throw e
    res.status(400).send('Bad Request')
    return
  }

  // calling an anonymous function to easily break out of nested ifs
  const status = await (async () => {
    const { regionSlug, apiKey } = params

    // When apiKey valid, we ignore the region check
    if (apiKey === process.env.ATLAS_API_KEY) {
      return 200 // <==========
    }

    const region = await db.region.findFirst({ where: { slug: regionSlug } })
    if (!region) {
      return 404 // <==========
    }

    if (region.exportPublic === true) {
      return 200 // <==========
    }

    await api(() => null) // required to get `getSession` working
    const session = await getSession(req, res)
    const { userId, role } = session

    if (!userId) {
      return 403 // <==========
    }

    if (role === 'ADMIN') {
      return 200 // <==========
    }

    const membershipExists = !!(await db.membership.count({
      where: { userId: userId!, region: { slug: regionSlug } },
    }))
    if (!membershipExists) {
      return 403 // <==========
    }

    // LATER: Check input bounding box if inside region bbox

    return 200 // <==========
  })()

  if (status !== 200) {
    res.status(status).send(status)
  }

  try {
    const { tableName, minlon, minlat, maxlon, maxlat } = params
    const functionName = exportFunctionIdentifier(tableName)

    const binaryResponse = await geoDataClient.$queryRawUnsafe<Buffer>(
      `SELECT * FROM "${functionName}"(
        ( SELECT * FROM ST_SetSRID(ST_MakeEnvelope(${minlon}, ${minlat}, ${maxlon}, ${maxlat}), 4326) )
      ) AS data`,
    )

    res.setHeader('Content-Disposition', `attachment; filename="${tableName}.fgb"`)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.send(binaryResponse[0]?.['data'])
  } catch (e) {
    if (!isProd) throw e
    res.status(500).send('Internal Server Error')
  }
}
