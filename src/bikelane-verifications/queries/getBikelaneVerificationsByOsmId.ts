import { paginate } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db, { Prisma } from 'db'

type GetBikelaneVerificationsInput = Pick<
  Prisma.BikelaneVerificationFindManyArgs,
  'skip' | 'take'
> & { osmId: number }

export default resolver.pipe(
  // resolver.authorize(), // TODO Migration
  async ({ osmId, skip = 0, take = 100 }: GetBikelaneVerificationsInput) => {
    const {
      items: verifications,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.bikelaneVerification.count({ where: { osm_id: osmId, osm_type: 'W' } }),
      query: (paginateArgs) =>
        db.bikelaneVerification.findMany({
          ...paginateArgs,
          where: { osm_id: osmId, osm_type: 'W' },
          orderBy: { verified_at: 'desc' },
        }),
    })

    return {
      verifications,
      nextPage,
      hasMore,
      count,
    }
  },
)
