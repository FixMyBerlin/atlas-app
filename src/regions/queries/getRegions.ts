import { paginate } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db, { Prisma } from 'db'

interface GetRegionsInput
  extends Pick<Prisma.RegionFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'> {}

export default resolver.pipe(
  resolver.authorize(),
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

    return {
      regions,
      nextPage,
      hasMore,
      count,
    }
  },
)
