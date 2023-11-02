import { resolver } from '@blitzjs/rpc'
import { paginate } from 'blitz'
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
            name: true,
            email: true,
            role: true,
            // We cannot pass this part via select in the page component since TS will not be able to infer the types then
            Membership: { select: { id: true, region: { select: { slug: true } } } },
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
