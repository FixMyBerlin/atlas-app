import { resolver } from '@blitzjs/rpc'
import { NotFoundError, paginate } from 'blitz'
import db, { Prisma } from 'db'
import { additionalRegionAttributes } from '../components/additionalRegionAttributes.const'
import getRegions from './getRegions'

interface GetRegionsInput
  extends Pick<Prisma.RegionFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'> {}

export type TRegion = Awaited<ReturnType<typeof getRegions>>[number]

export default resolver.pipe(
  resolver.authorize('ADMIN'),
  async ({ where, orderBy }: GetRegionsInput) => {
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

    return regionsWithAdditionalData
  },
)
