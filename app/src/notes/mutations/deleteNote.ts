import { resolver } from '@blitzjs/rpc'
import { AuthorizationError } from 'blitz'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from 'src/regions/queries/getRegionIdBySlug'
import { z } from 'zod'

const Schema = z.object({ regionSlug: z.string(), noteId: z.number() })

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ noteId }, ctx) => {
    const { session } = ctx

    // Only author may delete own note
    const { userId: dbUserId } = await db.note.findFirstOrThrow({
      where: { id: noteId },
      select: { userId: true },
    })

    if (!session.userId || dbUserId !== session.userId) {
      throw new AuthorizationError()
    }

    // Note: schema.prisma defines an `onDelete: cascade` rule which will remove all noteComments whenever a node is deleted
    // Docs: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions#cascade
    const result = await db.note.deleteMany({
      where: { id: noteId },
    })
    return result
  },
)
