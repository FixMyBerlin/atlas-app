import { z } from 'zod'

export const RegionSchema = z.object({
  slug: z.string(),
  public: z.boolean(),
  exportPublic: z.boolean(),
})

const trueOrFalse = z.enum(['true', 'false']).transform((v) => v === 'true')
export const RegionFormSchema = RegionSchema.omit({ public: true, exportPublic: true }).merge(
  z.object({
    public: trueOrFalse,
    exportPublic: trueOrFalse,
  }),
)

export const DeleteRegionSchema = z.object({
  slug: z.string(),
})
