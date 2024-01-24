import { z } from 'zod'

export const UploadSchema = z.object({
  id: z.number(),
  slug: z.string(),
  externalUrl: z.string().url(),
})

export const GetUploadSchema = UploadSchema.pick({ slug: true })
