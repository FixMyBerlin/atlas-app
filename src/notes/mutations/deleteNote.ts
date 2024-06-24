import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { DeleteNoteSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(DeleteNoteSchema),
  resolver.authorize('ADMIN'),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const note = await db.note.deleteMany({ where: { id } })

    return note
  },
)
