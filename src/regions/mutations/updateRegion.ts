import { resolver } from '@blitzjs/rpc'
import db from 'db'
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
