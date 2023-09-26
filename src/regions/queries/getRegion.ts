import { NotFoundError } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { z } from 'zod'

const GetRegion = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, 'Required'),
})

export default resolver.pipe(resolver.zod(GetRegion), resolver.authorize(), async ({ id }) => {
  const region = await db.region.findFirst({ where: { id } })

  if (!region) throw new NotFoundError()

  return region
})
