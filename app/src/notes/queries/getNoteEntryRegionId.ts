import db from '@/db'

const getNoteRegionId = async (input: Record<string, any>) =>
  (
    await db.note.findFirstOrThrow({
      where: { id: input.id || null },
      select: { regionId: true },
    })
  ).regionId

export default getNoteRegionId
