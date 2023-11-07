import { z } from 'zod'

export const RegionSchema = z.object({
  slug: z.string(),
  public: z.coerce.boolean(),
})

export const RegionFormSchema = RegionSchema.merge(
  z.object({
    public: z.string(),
  }),
)

export const DeleteRegionSchema = z.object({
  slug: z.string(),
})
