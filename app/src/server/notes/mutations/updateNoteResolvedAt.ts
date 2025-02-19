import db from '@/db'
import { authorizeRegionAdmin } from '@/src/server/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from '@/src/server/regions/queries/getRegionIdBySlug'
import { resolver } from '@blitzjs/rpc'
import { z } from 'zod'

const Schema = z.object({
  noteId: z.number(),
  regionSlug: z.string(),
  resolved: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ noteId, resolved }) => {
    const result = await db.note.update({
      where: { id: noteId },
      data: { resolvedAt: resolved ? new Date() : null },
    })
    return result
  },
)
