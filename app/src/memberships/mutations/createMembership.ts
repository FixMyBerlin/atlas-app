import db from '@/db'
import { resolver } from '@blitzjs/rpc'
import { MembershipSchema } from '../schema'

export default resolver.pipe(
  resolver.zod(MembershipSchema),
  resolver.authorize('ADMIN'),
  async (input) => {
    return await db.membership.create({ data: input })
  },
)
