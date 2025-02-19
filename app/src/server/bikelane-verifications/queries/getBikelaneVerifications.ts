import db, { Prisma } from '@/db'
import { resolver } from '@blitzjs/rpc'
import { paginate } from 'blitz'
import { VerificationSchema } from '../schemas'

type GetBikelaneVerificationsInput = Pick<
  Prisma.BikelaneVerificationFindManyArgs,
  'where' | 'skip' | 'take'
>

export default resolver.pipe(
  resolver.authorize('ADMIN'),
  async ({ where, skip = 0, take = 100 }: GetBikelaneVerificationsInput) => {
    const {
      items: verifications,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.bikelaneVerification.count({ where }),
      query: (paginateArgs) =>
        db.bikelaneVerification.findMany({
          ...paginateArgs,
          where,
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
