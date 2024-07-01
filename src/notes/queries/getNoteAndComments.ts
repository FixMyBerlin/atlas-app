import { resolver } from '@blitzjs/rpc'
import { point } from '@turf/turf'
import { NotFoundError } from 'blitz'
import db from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
import { z } from 'zod'
import getNoteRegionId from './getNoteEntryRegionId'
import { NoteAndCommentsSchema } from '../schemas'
import getNoteAndComments from './getNoteAndComments'

const GetNote = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
})

export type NoteAndComments = Awaited<ReturnType<typeof getNoteAndComments>>
export type NoteComment = NonNullable<
  Awaited<ReturnType<typeof getNoteAndComments>>['noteComments']
>[number]

export default resolver.pipe(
  resolver.zod(GetNote),
  authorizeRegionAdmin(getNoteRegionId),
  async ({ id }) => {
    const author = {
      id: true,
      osmName: true,
      // osmAvatar: true, // Not used ATM
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

    return NoteAndCommentsSchema.parse(note)
  },
)
