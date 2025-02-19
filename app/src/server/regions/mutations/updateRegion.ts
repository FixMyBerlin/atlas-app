import db from '@/db'
import { resolver } from '@blitzjs/rpc'
import { RegionSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(RegionSchema),
  resolver.authorize('ADMIN'),
  async ({ slug, ...input }) => {
    const region = await db.region.update({
      where: { slug },
      data: input,
    })

    return region
  },
)
