import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { z } from 'zod'
import { MembershipSchema } from '../schema'

const UpdateMembership = MembershipSchema.merge(
  z.object({
    id: z.number(),
  }),
)

export default resolver.pipe(
  resolver.zod(UpdateMembership),
  resolver.authorize('ADMIN'),
  async ({ id, ...data }) => {
    return await db.membership.update({ where: { id }, data })
  },
)
