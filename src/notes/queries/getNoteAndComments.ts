import { resolver } from '@blitzjs/rpc'
import { point } from '@turf/turf'
import { NotFoundError } from 'blitz'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
import { z } from 'zod'
import getNoteRegionId from './getNoteEntryRegionId'
import { NoteAndCommentsSchema } from '../schemas'

const GetNote = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
})

export default resolver.pipe(
  resolver.zod(GetNote),
  authorizeRegionAdmin(getNoteRegionId),
  async ({ id }) => {
    const author = {
      osmName: true,
      osmAvatar: true,
      role: true,
      firstName: true,
      lastName: true,
    }

    const note = await db.note.findFirst({
      where: { id },
      include: {
        noteComments: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            body: true,
            author: { select: author },
          },
          orderBy: { id: 'asc' },
        },
        author: { select: author },
      },
    })

    if (!note) throw new NotFoundError()

    return note
  },
  resolver.zod(NoteAndCommentsSchema),
)
