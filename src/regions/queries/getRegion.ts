import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db from 'db'
import { z } from 'zod'
import { staticRegion } from '../../app/regionen/(index)/_data/regions.const'
import getRegion from './getRegion'

const GetRegion = z.object({
  // This accepts type of undefined, but is required at runtime
  slug: z.string().optional().refine(String, 'Required'),
})

export type TRegion = Awaited<ReturnType<typeof getRegion>>

export default resolver.pipe(resolver.zod(GetRegion), async ({ slug }) => {
  if (!slug) throw new NotFoundError()

  const region = await db.region.findFirst({
    where: { slug },
  })

  if (!region) throw new NotFoundError()

  const additionalData = staticRegion.find((addData) => addData.slug === region.slug)

  if (!additionalData) throw new NotFoundError()

  return { ...region, ...additionalData }
})
