import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { UpdateRegionSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(UpdateRegionSchema),
  resolver.authorize('ADMIN'),
  async ({ id, ...data }) => {
    const region = await db.region.update({ where: { id }, data })

    return region
  },
)
