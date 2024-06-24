import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { DeleteNoteCommentSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(DeleteNoteCommentSchema),
  resolver.authorize('ADMIN'),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const noteComment = await db.noteComment.deleteMany({ where: { id } })

    return noteComment
  },
)
