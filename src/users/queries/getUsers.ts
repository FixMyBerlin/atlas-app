import { paginate } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db, { Prisma } from 'db'

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
            firstName: true,
            lastName: true,
            email: true,
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
