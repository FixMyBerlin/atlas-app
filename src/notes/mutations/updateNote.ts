import { resolver } from '@blitzjs/rpc'
import { AuthorizationError } from 'blitz'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from 'src/regions/queries/getRegionIdBySlug'
import { z } from 'zod'

const Schema = z.object({
  noteId: z.number(),
  subject: z.string(),
  body: z.string(),
  resolved: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ noteId, subject, body, resolved }, ctx) => {
    const { session } = ctx

    // Only author may update own note
    const { userId: dbUserId } = await db.note.findFirstOrThrow({
      where: { id: noteId },
      select: { userId: true },
    })

    if (!session.userId || dbUserId !== session.userId) {
      throw new AuthorizationError()
    }

    const result = await db.note.update({
      where: { id: noteId },
      data: { subject, body, resolvedAt: resolved ? new Date() : null },
    })
    return result
  },
)
