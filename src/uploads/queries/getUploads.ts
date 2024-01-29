import { resolver } from '@blitzjs/rpc'
import { paginate } from 'blitz'
import db, { Prisma } from 'db'

type GetUploadInput = Pick<Prisma.UploadFindManyArgs, 'where' | 'skip' | 'take'>

export default resolver.pipe(
  resolver.authorize('ADMIN'),
  async ({ where, skip = 0, take = 100 }: GetUploadInput) => {
    const {
      items: uploads,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.upload.count({ where }),
      query: (paginateArgs) =>
        db.upload.findMany({
          ...paginateArgs,
          where,
          include: {
            regions: {
              select: {
                slug: true,
              },
            },
          },
        }),
    })

    return {
      uploads,
      nextPage,
      hasMore,
      count,
    }
  },
)
