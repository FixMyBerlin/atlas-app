import { resolver } from '@blitzjs/rpc'
import { featureCollection, point } from '@turf/turf'
import db from 'db'
import { zodAtlasFilterParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useNotesAtlasParams'
import { z } from 'zod'
import getNotesAndCommentsForRegion from './getNotesAndCommentsForRegion'

const Schema = z.object({
  regionSlug: z.string(),
  filter: zodAtlasFilterParam.nullish(),
})

export type NotesAndCommentsFeatureCollection = Awaited<
  ReturnType<typeof getNotesAndCommentsForRegion>
>

export default resolver.pipe(
  // resolver.authorize(), // membership Check is done below becaues we don't want to throw
  resolver.zod(Schema),
  async ({ regionSlug, filter }, ctx) => {
    const { session } = ctx

    const notes = await db.note.findMany({
      where: { region: { slug: regionSlug } },
      select: {
        id: true,
        resolvedAt: true,
        longitude: true,
        latitude: true,
        regionId: true,
        subject: true,
        body: true,
        author: { select: { id: true, osmName: true, firstName: true, lastName: true } },
        noteComments: { select: { id: true, body: true } },
      },
      orderBy: { id: 'asc' },
    })

    const notePoints = notes.map((note) => {
      const coordinates = [note.longitude, note.latitude]
      // We transform the properties for <SourcesLayersAtlasNotes />
      const properties = {
        id: note.id,
        status: note.resolvedAt ? 'closed' : 'open',
        regionId: note.regionId,
        authorId: note.author.id,
        hasComments: note.noteComments.length > 0,
      }

      return point(coordinates, properties, { id: note.id })
    })

    // Only logged in users see data
    if (!session?.userId) {
      return { featureCollection: featureCollection([] as typeof notePoints) }
    }

    // Only logged members (or admins) see data
    const memberships = await db.membership.findMany({ where: { userId: session.userId } })
    const membershipRegionIds = memberships.map((membership) => membership.regionId)

    const regionNotes =
      session.role === 'ADMIN'
        ? notePoints
        : notePoints.filter((note) => membershipRegionIds.includes(note.properties.regionId))

    // Filter data
    let filteredNotes = regionNotes
    if (filter) {
      // Filter by `query` on note.body/subject or any note.comment.body
      filteredNotes = filteredNotes.filter((note) => {
        if (typeof filter.query !== 'string') return true
        const fullNote = notes.find((fNote) => fNote.id == note.properties.id)
        if (fullNote?.subject?.includes(filter.query)) return true
        if (fullNote?.body?.includes(filter.query)) return true
        if (fullNote?.noteComments?.some((c) => filter.query && c.body.includes(filter.query)))
          return true
        return false
      })
      // Filter by `completed` on note.status
      filteredNotes = filteredNotes.filter((note) => {
        if (typeof filter.completed !== 'boolean') return true
        if (filter.completed === true && note.properties.status === 'closed') return true
        if (filter.completed === false && note.properties.status === 'open') return true
        return false
      })
      // Filter by `user` on note.authorId
      filteredNotes = filteredNotes.filter((note) => {
        if (typeof filter.user !== 'number') return true
        if (filter.user === note.properties.authorId) return true
        return false
      })
      // Filter by `commented` on note.noteComments
      filteredNotes = filteredNotes.filter((note) => {
        if (typeof filter.commented !== 'boolean') return true
        const fullNote = notes.find((fNote) => fNote.id == note.properties.id)
        if (filter.commented === Boolean(fullNote?.noteComments?.length)) return true
        return false
      })
    }

    // A list of all authors that have written notes (only notes, not comments)
    // Used for the <FilterControl>
    const authorIds = [...new Set(regionNotes.map((note) => note.properties.authorId))]
    const authors = authorIds.map((authorId) => {
      const authorNotes = notes.filter((note) => note.author.id === authorId)
      const author = authorNotes?.[0]?.author
      return {
        id: authorId,
        osmName: author?.osmName,
        firstName: author?.firstName,
        lastName: author?.lastName,
        count: authorNotes.length,
        currentUser: session.userId === authorId,
      }
    })

    // Count stats for notes, always counting the **unfiletered** list
    // Used in <FilterControl> before any filteres are applied (because after, the numbers are wrong and hard to calculated wihtout a faceted search)
    const stats = {
      commented: regionNotes.filter((n) => n.properties.hasComments === true).length,
      uncommented: regionNotes.filter((n) => n.properties.hasComments === false).length,
      completed: regionNotes.filter((n) => n.properties.status === 'closed').length,
      uncompleted: regionNotes.filter((n) => n.properties.status === 'open').length,
      filteredTotal: filteredNotes.length,
    }

    return { featureCollection: featureCollection(filteredNotes), authors, stats }
  },
)
