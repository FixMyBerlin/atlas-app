import db from 'db'
import { z } from 'zod'
import { checkApiKey } from '../../_util/checkApiKey'

const Schema = z.object({
  apiKey: z.string().nullish(),
  uploadSlug: z.string(),
  externalUrl: z.string(),
  regionSlugs: z.array(z.string()),
  isPublic: z.boolean(),
})

const parseData = (body, Schema) => {
  try {
    const data = Schema.parse(body)
    return { ok: true, data, errorResponse: null }
  } catch (e) {
    return {
      ok: false,
      data: null,
      errorResponse: Response.json({ statusText: 'Bad Request' }, { status: 400 }),
    }
  }
}

export async function POST(request: Request) {
  const parsed = parseData(await request.json(), Schema)
  if (!parsed.ok) return parsed.errorResponse
  const { data } = parsed

  const check = checkApiKey(data)
  if (!check.ok) return check.errorResponse

  const { uploadSlug, externalUrl, regionSlugs, isPublic } = data

  await db.upload.deleteMany({ where: { slug: uploadSlug } })

  try {
    await db.upload.create({
      data: {
        slug: uploadSlug,
        externalUrl,
        regions: { connect: regionSlugs.map((slug) => ({ slug })) },
        public: isPublic,
      },
    })
  } catch (e) {
    return Response.json({ statusText: 'Bad Request', message: e.message }, { status: 400 })
  }

  return Response.json({ statusText: 'Created' }, { status: 201 })
}
