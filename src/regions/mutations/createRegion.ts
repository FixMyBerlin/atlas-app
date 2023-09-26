import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { CreateRegionSchema } from '../schemas'

export default resolver.pipe(
  resolver.zod(CreateRegionSchema),
  resolver.authorize(),
  async (input) => {
    const region = await db.region.create({ data: input })

    return region
  },
)
