import { resolver } from '@blitzjs/rpc'
import { paginate } from 'blitz'
import db, { Prisma } from 'db'
import { authorizeRegionAdmin } from 'src/authorization/authorizeRegionAdmin'
import getRegionIdBySlug from 'src/regions/queries/getRegionIdBySlug'
import { VerificationSchema } from '../schemas'

type GetBikelaneVerificationsInput = Pick<
  Prisma.BikelaneVerificationFindManyArgs,
  'skip' | 'take'
> & { osmId: string; regionSlug: string }

export default resolver.pipe(
  authorizeRegionAdmin(getRegionIdBySlug),
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

    // Transforms bigInt to number
    const transformed = verifications.map((v) => VerificationSchema.parse(v))

    return {
      verifications: transformed,
      nextPage,
      hasMore,
      count,
    }
  },
)
