import db from '@/db'
import { resolver } from '@blitzjs/rpc'
import { z } from 'zod'

const Schema = z.object({
  regionSlug: z.string(),
})

export default resolver.pipe(resolver.zod(Schema), async ({ regionSlug }, ctx) => {
  const { session } = ctx

  const uploads = await db.upload.findMany({
    where: { regions: { some: { slug: regionSlug } } },
    include: { regions: { select: { id: true, slug: true } } },
  })

  if (!session.userId) {
    return uploads.filter((upload) => upload.public)
  } else if (session.role === 'ADMIN') {
    return uploads
  } else {
    const memberships = await db.membership.findMany({ where: { userId: session.userId } })
    const membershipRegionIds = memberships.map((membership) => membership.regionId)
    return uploads.filter(
      (upload) =>
        upload.public || upload.regions.some((region) => membershipRegionIds.includes(region.id)),
    )
  }
})
