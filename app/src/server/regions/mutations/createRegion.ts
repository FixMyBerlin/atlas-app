import db from '@/db'
import { resolver } from '@blitzjs/rpc'
import { RegionSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(RegionSchema),
  resolver.authorize('ADMIN'),
  async (input) => {
    const region = await db.region.create({
      data: input,
    })

    return region
  },
)
