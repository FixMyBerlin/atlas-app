import db from '@/db'
import { resolver } from '@blitzjs/rpc'
import { DeleteRegionSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(DeleteRegionSchema),
  resolver.authorize('ADMIN'),
  async ({ slug }) => {
    const region = await db.region.deleteMany({ where: { slug } })

    return region
  },
)
