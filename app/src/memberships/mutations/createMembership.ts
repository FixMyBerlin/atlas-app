import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { MembershipSchema } from '../schema'

export default resolver.pipe(
  resolver.zod(MembershipSchema),
  resolver.authorize('ADMIN'),
  async (input) => {
    return await db.membership.create({ data: input })
  },
)
