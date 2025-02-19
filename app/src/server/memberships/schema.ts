import { z } from 'zod'

export const MembershipSchema = z.object({
  userId: z.coerce.number(),
  regionId: z.coerce.number(),
})
