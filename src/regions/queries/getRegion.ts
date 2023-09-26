import { NotFoundError } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { z } from 'zod'

const GetRegion = z.object({
  // This accepts type of undefined, but is required at runtime
  slug: z.string().optional().refine(String, 'Required'),
})

export default resolver.pipe(
  resolver.zod(GetRegion),
  // resolver.authorize(),
  async ({ slug }) => {
    const region = await db.region.findFirst({ where: { slug } })

    if (!region) throw new NotFoundError()

    return region
  },
)
