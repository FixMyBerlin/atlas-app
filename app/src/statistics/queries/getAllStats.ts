import { geoDataClient } from '@/src/prisma-client'
import { resolver } from '@blitzjs/rpc'
import { getAllStatistics } from '@prisma/client/sql'
import { NotFoundError } from 'blitz'

export default resolver.pipe(async () => {
  const stats = await geoDataClient.$queryRawTyped(getAllStatistics())

  if (!stats) throw new NotFoundError()

  return stats
})
