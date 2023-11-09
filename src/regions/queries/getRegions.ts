import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db, { Prisma } from 'db'
import { additionalRegionAttributes } from '../components/additionalRegionAttributes.const'
import { TRegion } from './getRegion'

interface GetRegionsInput
  extends Pick<Prisma.RegionFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'> {}

export default resolver.pipe(async ({ where, orderBy }: GetRegionsInput) => {
  const regions = await db.region.findMany({ where, orderBy })

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

  return regionsWithAdditionalData satisfies TRegion[]
})
