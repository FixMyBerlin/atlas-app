import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { UpdateRegionSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(UpdateRegionSchema),
  resolver.authorize('ADMIN'),
  async ({ slug, ...data }) => {
    const region = await db.region.update({ where: { slug }, data })

    return region
  },
)
