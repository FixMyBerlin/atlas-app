import { resolver } from '@blitzjs/rpc'
import db, { Prisma } from 'db'
import { additionalRegionAttributes } from '../components/additionalRegionAttributes.const'
import getPublicRegions from './getPublicRegions'

type GetRegionsInput = Pick<Prisma.RegionFindManyArgs, 'where'>

export type TPublicRegion = Awaited<ReturnType<typeof getPublicRegions>>[number]

export default resolver.pipe(async ({ where }: GetRegionsInput) => {
  const regions = await db.region.findMany({
    where: { ...where, public: true },
    orderBy: { id: 'asc' },
    select: { slug: true, shortName: true, name: true },
  })

  const regionsWithAdditionalData = regions.map((region) => {
    const additionalData = additionalRegionAttributes.find(
      (addData) => addData.slug === region.slug,
    )
    return {
      ...region,
      ...additionalData,
    }
  })

  return regionsWithAdditionalData
})
