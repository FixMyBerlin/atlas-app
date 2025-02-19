import db from '@/db'
import { resolver } from '@blitzjs/rpc'
import { ProcessingDates } from '../schemas'

export default resolver.pipe(
  // resolver.authorize(/* ok */), // Open without Auth
  async ({}) => {
    type Query = { processed_at: string; osm_data_from: string }[]
    const result = await db.$queryRaw<Query>`
      SELECT processed_at, osm_data_from
      FROM public.meta
      ORDER BY id DESC
      LIMIT 1
    `

    return ProcessingDates.parse(result[0])
  },
)
