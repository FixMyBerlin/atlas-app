import { z } from 'zod'

const Author = z.object({
  osmName: z.string(),
  osmAvatar: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['ADMIN', 'USER']),
})

export const NoteAndCommentsSchema = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.number(),
  author: Author,
  subject: z.string(),
  body: z.string().nullable(),
  resolvedAt: z.union([z.null(), z.coerce.date()]),
  latitude: z.number(),
  longitude: z.number(),
  noteComments: z
    .array(
      z.object({
        id: z.number(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
        author: Author,
        body: z.string(),
      }),
    )
    .optional(),
})

export const CreateNoteSchema = z.object({
  // id: z.number(),
  // createdAt: z.string(),
  // updatedAt: z.string(),
  // userId: z.number(),
  // regionId: z.number(),
  subject: z.string(),
  body: z.string().optional(),
  // resolvedAt: z.date(),
  latitude: z.number(),
  longitude: z.number(),
})

export const UpdateNoteSchema = CreateNoteSchema.merge(
  z.object({
    id: z.number(),
    regionId: z.undefined(),
  }),
)

export const DeleteNoteSchema = z.object({
  id: z.number(),
})

export const CreateNoteCommentSchema = z.object({
  // id: z.string(),
  // createdAt: z.string(),
  // updatedAt: z.string(),
  // userId: z.number(),
  noteId: z.number(),
  body: z.string(),
})

export const UpdateNoteCommentSchema = CreateNoteCommentSchema.merge(
  z.object({
    id: z.number(),
    noteId: z.string(),
  }),
)

export const DeleteNoteCommentSchema = z.object({
  id: z.number(),
})
