import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { RegionFormSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(RegionFormSchema),
  resolver.authorize('ADMIN'),
  async (input) => {
    const region = await db.region.create({
      data: {
        ...input,
        public: input.public === 'true' ? true : false,
      },
    })

    return region
  },
)
