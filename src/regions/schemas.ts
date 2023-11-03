import { z } from 'zod'

export const CreateRegionSchema = z.object({
  slug: z.string(),
  shortName: z.string(),
  name: z.string(),
  public: z.boolean(),
})

export const UpdateRegionSchema = CreateRegionSchema.merge(
  z.object({
    slug: z.string(),
  }),
)

export const DeleteRegionSchema = z.object({
  slug: z.string(),
})
