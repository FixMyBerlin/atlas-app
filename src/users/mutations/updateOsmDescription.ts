import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { UpdateOsmDescription } from '../schema'

export default resolver.pipe(
  resolver.zod(UpdateOsmDescription),
  resolver.authorize(/* ok */),
  async (data, ctx) => {
    return await db.user.update({ where: { id: ctx.session.userId }, data })
  },
)
