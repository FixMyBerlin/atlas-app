import db from 'db'
import { z } from 'zod'
import { resolver } from '@blitzjs/rpc'

export const MembershipSchema = z.object({
  userId: z.number(),
  regionSlug: z.string(),
})

export default resolver.pipe(
  resolver.zod(MembershipSchema),
  async ({ userId, regionSlug }) =>
    !!(await db.membership.count({
      where: { userId, region: { slug: regionSlug } },
    })),
)
