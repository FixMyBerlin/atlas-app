import db from '@/db'
import { z } from 'zod'
import { checkApiKey, parseData } from '../../_util/checkApiKey'

const Schema = z.object({
  apiKey: z.string().nullish(),
  uploadSlug: z.string(),
  url: z.string(),
  type: z.enum(['GEOJSON', 'PMTILES']),
  regionSlugs: z.array(z.string()),
  isPublic: z.boolean(),
  configs: z.array(z.record(z.string(), z.any())),
})

export async function POST(request: Request) {
  const parsed = parseData(await request.json(), Schema)
  if (!parsed.ok) return parsed.errorResponse
  const { data } = parsed

  const check = checkApiKey(data)
  if (!check.ok) return check.errorResponse

  const { uploadSlug, url, type, regionSlugs, isPublic, configs } = data

  await db.upload.deleteMany({ where: { slug: uploadSlug } })

  try {
    await db.upload.create({
      data: {
        slug: uploadSlug,
        url,
        type,
        regions: { connect: regionSlugs.map((slug) => ({ slug })) },
        public: isPublic,
        configs,
      },
    })
  } catch (e) {
    return Response.json({ statusText: 'Bad Request', message: e.message }, { status: 400 })
  }

  return Response.json({ statusText: 'Created' }, { status: 201 })
}
