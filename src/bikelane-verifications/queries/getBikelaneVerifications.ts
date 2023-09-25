import { paginate } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db, { Prisma } from 'db'

interface GetBikelaneVerificationsInput
  extends Pick<Prisma.BikelaneVerificationFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetBikelaneVerificationsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: bikelaneVerifications,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.bikelaneVerification.count({ where }),
      query: (paginateArgs) =>
        db.bikelaneVerification.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      bikelaneVerifications,
      nextPage,
      hasMore,
      count,
    }
  },
)
