import db from 'db'
import { z } from 'zod'
import { resolver } from '@blitzjs/rpc'

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
