import { geoDataClient } from '@/src/prisma-client'
import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'

export default resolver.pipe(async () => {
  const stats = await geoDataClient.$queryRaw`
    SELECT name, level, road_length, bikelane_length from public.aggregated_lengths;`

  if (!stats) throw new NotFoundError()

  return stats as { name: string; level: string; road_length: {}; bikelane_length: {} }[]
})
