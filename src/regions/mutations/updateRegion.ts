import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { RegionFormSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(RegionFormSchema),
  resolver.authorize('ADMIN'),
  async ({ slug, ...input }) => {
    const region = await db.region.update({
      where: { slug },
      data: { ...input, public: Boolean(input.public) },
    })

    return region
  },
)
