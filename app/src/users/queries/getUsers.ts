import db, { Prisma } from '@/db'
import { resolver } from '@blitzjs/rpc'
import { paginate } from 'blitz'

interface GetUsersInput
  extends Pick<Prisma.UserFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'> {}

export default resolver.pipe(
  resolver.authorize('ADMIN'),
  async ({ where, orderBy = { id: 'asc' }, skip = 0, take = 100 }: GetUsersInput) => {
    const {
      items: users,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.user.count({ where }),
      query: (paginateArgs) =>
        db.user.findMany({
          ...paginateArgs,
          where,
          orderBy,
          select: {
            id: true,
            osmId: true,
            osmName: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        }),
    })

    return {
      users,
      nextPage,
      hasMore,
      count,
    }
  },
)
