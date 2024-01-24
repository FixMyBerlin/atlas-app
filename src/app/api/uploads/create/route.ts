import db from 'db'
import { z } from 'zod'
import { checkApiKey } from '../../util'

const Schema = z.object({
  apiKey: z.string().nullish(),
  uploadSlug: z.string(),
  externalUrl: z.string(),
  regionSlug: z.string(),
})

const parseData = (body, Schema) => {
  try {
    const data = Schema.parse(body)
    return { ok: true, data, errorResponse: null }
  } catch (e) {
    return { ok: false, data: null, errorResponse: Response.json({ statusText: 'Bad Request' }, { status: 400 }) }
  }
}

export async function POST(request: Request) {
  const parsed = parseData(await request.json(), Schema)
  if (!parsed.ok) return parsed.errorResponse
  const { data } = parsed

  const check = checkApiKey(data)
  if (!check.ok) return check.errorResponse

  const { uploadSlug, externalUrl, regionSlug } = data
  try {
    const region = await db.region.findFirstOrThrow({ where: { slug: regionSlug } })
    await db.upload.create({
      data: {
        slug: uploadSlug,
        externalUrl,
        regionId: region.id,
      },
    })
  } catch (e) {
    return Response.json({ statusText: 'Bad Request', message: e.message }, { status: 400 })
  }

  return Response.json({ statusText: 'Created' }, { status: 201 })
}
