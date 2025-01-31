import { todoIds } from '@/src/processingTypes/todoId'
import { z } from 'zod'

export const radinfraDeCampaignSchema = z.array(
  z
    .object({
      id: z.enum(todoIds),
      name: z.string(),
      menuTitle: z.string(),
      pubDate: z.string().datetime(),
      category: z.string(),
      // "author": z.string(),
      // "inMenu": z.boolean(),
      // "language": z.string(),
      // "mapUrl": z.string().url(),
      maprouletteChallenge: z
        .object({
          id: z.number().nullable(),
          enabled: z.boolean(),
          name: z.string(),
          // "remoteGeoJson": z.string().url(),
          // "checkinComment": z.string(),
          // "checkinSource": z.string()
        })
        .strip(),
      description: z.string(),
      task: z.string(),
    })
    .strip(),
)

export type RadinfraDeCampaignSchema = z.infer<typeof radinfraDeCampaignSchema>[number]
