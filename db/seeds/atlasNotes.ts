import { Prisma } from '@prisma/client'
import db from '../index'

const seedAtlasNotes = async () => {
  // We cannot automate selecting the regions due to import errors with the logo svgs in regions.const.
  // We will have to create a custom region list here, for now.
  // const regionsWithAtlasNotes = staticRegion.filter((r) => r.notes === 'atlasNotes')
  const regionsWithAtlasNotes = [
    {
      slug: 'bb-sg',
      map: { lat: 52.3968, lng: 13.0342 },
    },
  ]

  const seedAtlasNoteComments: Prisma.NoteCommentUncheckedCreateInput[] = [
    {
      userId: 1,
      noteId: 999, // replaced below
      body: 'Ich stimme zu. **Fettdruck**.',
    },
    {
      userId: 2,
      noteId: 999, // replaced below
      updatedAt: new Date(),
      body: 'Ich habe das erledigt.',
    },
  ]

  for (const region of regionsWithAtlasNotes) {
    const regionForId = await db.region.findFirstOrThrow({ where: { slug: region.slug } })
    const seedAtlasNotes: Prisma.NoteUncheckedCreateInput = {
      userId: 2,
      regionId: regionForId.id,
      subject: 'X nicht Y',
      body: `
An dieser Stelle ist nicht X sondern Y zu finden.

**Fettdruck**

* Liste
* Liste
      `,
      latitude: region.map.lat,
      longitude: region.map.lng,
    }
    const note = await db.note.create({ data: seedAtlasNotes })
    for (const comment of seedAtlasNoteComments) {
      await db.noteComment.create({ data: { ...comment, noteId: note.id } })
    }

    const seedResolvedAtlasNotes: Prisma.NoteUncheckedCreateInput = {
      userId: 1,
      regionId: regionForId.id,
      subject: 'Prüfen ob Z richtig ist',
      body: `Dieser Hinweis ist bereits erledigt worden und außerdem bearbeitet.`,
      resolvedAt: new Date(),
      updatedAt: new Date(),
      latitude: region.map.lat + 0.2,
      longitude: region.map.lng + 0.2,
    }
    await db.note.create({ data: seedResolvedAtlasNotes })
  }
}

export default seedAtlasNotes
