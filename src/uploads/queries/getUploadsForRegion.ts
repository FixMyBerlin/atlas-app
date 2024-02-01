import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { z } from 'zod'

const Schema = z.object({
  regionSlug: z.string(),
})

export default resolver.pipe(
  resolver.zod(Schema),
  resolver.authorize('ADMIN'),
  async ({ regionSlug }) => {
    return db.upload.findMany({
      where: { regions: { some: { slug: regionSlug } } },
      include: { regions: { select: { slug: true } } },
    })
  },
)
