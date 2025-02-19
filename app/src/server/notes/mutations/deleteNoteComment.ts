import db from '@/db'
import { authorizeRegionAdmin } from '@/src/server/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from '@/src/server/regions/queries/getRegionIdBySlug'
import { resolver } from '@blitzjs/rpc'
import { AuthorizationError } from 'blitz'
import { z } from 'zod'

const Schema = z.object({ regionSlug: z.string(), commentId: z.number() })

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ commentId }, ctx) => {
    const { session } = ctx

    // Only author may delete own note comment
    const { userId: dbUserId } = await db.noteComment.findFirstOrThrow({
      where: { id: commentId },
      select: { userId: true },
    })

    if (!session.userId || dbUserId !== session.userId) {
      throw new AuthorizationError()
    }

    const result = await db.noteComment.deleteMany({
      where: { id: commentId },
    })
    return result
  },
)
