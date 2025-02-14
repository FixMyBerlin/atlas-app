import { z } from 'zod'

// REMINDER: Keep in sync with https://github.com/FixMyBerlin/radinfra.de/blob/main/cms/campaignsAstro.ts
const AstroCampaignBaseSchema = z.object({
  name: z.string(),
  menuTitle: z.string(),
  pubDate: z.string().datetime(),
  // pubDate: z
  //   .string()
  //   .transform((val) => new Date(val)),
  visibility: z.string(), //z.enum(visibilityOptions),
  category: z.string(), //z.enum(campaignCategories),
  // author: z.string(),
  // language: z.enum(languages).optional(),
  // mapUrl: z.string().url().optional(),
  description: z.string(),
  task: z.string(),
})
const AstroCampaignMaprouletteSchema = z.object({
  discriminant: z.literal(true),
  value: z.object({
    id: z.number().nullable().optional(),
    enabled: z.boolean(),
    name: z.string(),
    // remoteGeoJson: z.string().url(),
    // checkinComment: z.string(),
    // checkinSource: z.string(),
    resultsLimited: z.boolean(),
    rebuildAt: z.string().datetime().nullable().optional(),
  }),
})
export const AstroCampaignSchema = AstroCampaignBaseSchema.merge(
  z.object({
    maprouletteChallenge: z.union([
      AstroCampaignMaprouletteSchema,
      z.object({
        discriminant: z.literal(false),
      }),
    ]),
  }),
)
export const radinfraDeCampaignSchema = z.array(
  z.object({ id: z.string() }).merge(AstroCampaignSchema).strip(),
)

export type RadinfraDeCampaignSchema = z.infer<typeof radinfraDeCampaignSchema>[number]
