import db, { Prisma } from '@/db'
import { resolver } from '@blitzjs/rpc'
import { paginate } from 'blitz'
import getUploads from './getUploads'

type GetUploadInput = Pick<Prisma.UploadFindManyArgs, 'where' | 'skip' | 'take'>

export type TUpload = Awaited<ReturnType<typeof getUploads>>['uploads'][number]

export default resolver.pipe(
  resolver.authorize('ADMIN'),
  async ({ where, skip = 0, take = 250 }: GetUploadInput) => {
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
