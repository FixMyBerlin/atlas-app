import { paginate } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db, { Prisma } from 'db'
import { additionalRegionAttributes } from '../components/additionalRegionAttributes.const'
import getRegions from './getRegions'

interface GetRegionsInput
  extends Pick<Prisma.RegionFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'> {}

export type TRegion = Awaited<ReturnType<typeof getRegions>>['regions'][number]

export default resolver.pipe(
  resolver.authorize('ADMIN'),
  async ({ where, orderBy, skip = 0, take = 100 }: GetRegionsInput) => {
    const {
      items: regions,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.region.count({ where }),
      query: (paginateArgs) => db.region.findMany({ ...paginateArgs, where, orderBy }),
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

    return {
      regions: regionsWithAdditionalData,
      nextPage,
      hasMore,
      count,
    }
  },
)
