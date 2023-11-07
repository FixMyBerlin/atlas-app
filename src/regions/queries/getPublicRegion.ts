import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db from 'db'
import { z } from 'zod'
import { additionalRegionAttributes } from '../components/additionalRegionAttributes.const'
import getPublicRegion from './getPublicRegion'

const GetRegion = z.object({
  // This accepts type of undefined, but is required at runtime
  slug: z.string().optional().refine(String, 'Required'),
})

export type TRegion = Awaited<ReturnType<typeof getPublicRegion>>

export default resolver.pipe(
  resolver.zod(GetRegion),
  // resolver.authorize(), // This data is public
  async ({ slug }) => {
    if (!slug) throw new NotFoundError()

    const region = await db.region.findFirst({
      where: { slug, public: true },
      // Only public data:
      select: { slug: true },
    })

    if (!region) throw new NotFoundError()

    const additionalData = additionalRegionAttributes.find(
      (addData) => addData.slug === region.slug,
    )

    if (!additionalData) throw new NotFoundError()

    return { ...region, ...additionalData }
  },
)
