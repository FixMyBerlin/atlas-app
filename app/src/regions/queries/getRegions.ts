import { resolver } from '@blitzjs/rpc'
import db, { Prisma } from 'db'

interface GetRegionsInput
  extends Pick<Prisma.RegionFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'> {}

export default resolver.pipe(
  resolver.authorize('ADMIN'),
  async ({ where, orderBy = { slug: 'asc' } }: GetRegionsInput) =>
    await db.region.findMany({ where, orderBy }),
)
