import db from '@/db'
import { resolver } from '@blitzjs/rpc'
import { z } from 'zod'

export const MembershipSchema = z.object({
  userId: z.number().nullish(),
  regionSlug: z.string().nullish(),
})

export default resolver.pipe(resolver.zod(MembershipSchema), async ({ userId, regionSlug }) => {
  if (!userId || !regionSlug) return false

  const count = await db.membership.count({
    where: { userId, region: { slug: regionSlug } },
  })
  return Boolean(count)
})
