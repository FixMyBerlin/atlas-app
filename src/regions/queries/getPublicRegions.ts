import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db, { Prisma } from 'db'
import { additionalRegionAttributes } from '../components/additionalRegionAttributes.const'
import getPublicRegions from './getPublicRegions'

type GetRegionsInput = Pick<Prisma.RegionFindManyArgs, 'where'>

export type TPublicRegion = Awaited<ReturnType<typeof getPublicRegions>>[number]

export default resolver.pipe(async ({ where }: GetRegionsInput) => {
  const regions = await db.region.findMany({
    where: { ...where, public: true },
    orderBy: { id: 'asc' },
    // Only public data:
    select: { slug: true },
  })

  const regionsWithAdditionalData = regions.map((region) => {
    const additionalData = additionalRegionAttributes.find(
      (addData) => addData.slug === region.slug,
    )

    // This is a TS guard to make sure TS understands that we will always have `additionalData` which we really should, unless we manually break things.
    if (!additionalData) throw new NotFoundError()

    return {
      ...region,
      ...additionalData,
    }
  })

  return regionsWithAdditionalData
})
