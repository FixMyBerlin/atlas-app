import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { CreateNoteCommentSchema } from '../schemas'
import { z } from 'zod'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from 'src/regions/queries/getRegionIdBySlug'
import { AuthorizationError } from 'blitz'

const Schema = CreateNoteCommentSchema.merge(
  z.object({ regionSlug: z.string(), noteId: z.number() }),
)

export default resolver.pipe(
  resolver.zod(Schema),
  authorizeRegionAdmin(getRegionIdBySlug),
  async ({ noteId, body }, ctx) => {
    const { session } = ctx

    if (!session.userId) {
      throw new AuthorizationError()
    }

    const result = await db.noteComment.create({
      data: { noteId, body, userId: session.userId },
    })
    return result
  },
)
