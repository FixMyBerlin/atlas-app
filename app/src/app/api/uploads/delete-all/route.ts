import db from '@/db'
import { z } from 'zod'
import { checkApiKey, parseData } from '../../_util/checkApiKey'

const Schema = z.object({
  apiKey: z.string().nullish(),
})

export async function DELETE(request: Request) {
  const parsed = parseData(await request.json(), Schema)
  if (!parsed.ok) return parsed.errorResponse
  const { data } = parsed

  const check = checkApiKey(data)
  if (!check.ok) return check.errorResponse

  try {
    await db.upload.deleteMany({ where: { createdBy: 'SCRIPT' } })
  } catch (e) {
    return Response.json(
      { statusText: 'Internal Server Error', message: e.message },
      { status: 500 },
    )
  }

  return Response.json({ statusText: 'Deleted' }, { status: 200 })
}
