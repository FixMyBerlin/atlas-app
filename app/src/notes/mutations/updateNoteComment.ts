import db from '@/db'
import { authorizeRegionAdmin } from '@/src/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from '@/src/regions/queries/getRegionIdBySlug'
import { resolver } from '@blitzjs/rpc'
import { AuthorizationError } from 'blitz'
import { z } from 'zod'

const Schema = z.object({ regionSlug: z.string(), commentId: z.number(), body: z.string() })

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ commentId, body }, ctx) => {
    const { session } = ctx

    // Only author may update own note comment
    const { userId: dbUserId } = await db.noteComment.findFirstOrThrow({
      where: { id: commentId },
      select: { userId: true },
    })

    if (!session.userId || dbUserId !== session.userId) {
      throw new AuthorizationError()
    }

    const result = await db.noteComment.update({
      where: { id: commentId },
      data: { body },
    })
    return result
  },
)
