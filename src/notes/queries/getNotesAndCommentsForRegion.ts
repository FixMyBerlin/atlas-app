import { resolver } from '@blitzjs/rpc'
import { featureCollection, point } from '@turf/turf'
import db from 'db'
import { z } from 'zod'
import getNotesAndCommentsForRegion from './getNotesAndCommentsForRegion'

const Schema = z.object({
  regionSlug: z.string(),
})

export type NotesAndCommentsFeatureCollection = Awaited<
  ReturnType<typeof getNotesAndCommentsForRegion>
>

export default resolver.pipe(
  // resolver.authorize(), // membership Check is done below becaues we don't want to throw
  resolver.zod(Schema),
  async ({ regionSlug }, ctx) => {
    const { session } = ctx

    // Only logged in users see data
    if (!session?.userId) return featureCollection([])

    const notes = await db.note.findMany({
      where: { region: { slug: regionSlug } },
      select: {
        id: true,
        resolvedAt: true,
        longitude: true,
        latitude: true,
        regionId: true,
        author: { select: { osmName: true } },
      },
      orderBy: { id: 'asc' },
    })

    // Only logged members (or admins) see data
    const memberships = await db.membership.findMany({ where: { userId: session.userId } })
    const membershipRegionIds = memberships.map((membership) => membership.regionId)

    const regionNotes =
      session.role === 'ADMIN'
        ? notes
        : notes.filter((note) => membershipRegionIds.includes(note.regionId))

    const resultFeatures = regionNotes.map((note) => {
      const { longitude, latitude, author, resolvedAt, id } = note
      const coordinates = [longitude, latitude]
      // We transform the properties for <SourcesLayersAtlasNotes />
      const properties = { osmName: author.osmName, status: resolvedAt ? 'closed' : 'open', id }

      return point(coordinates, properties, { id: note.id })
    })
    return featureCollection(resultFeatures)
  },
)
