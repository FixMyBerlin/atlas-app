import { Ctx } from 'blitz'
import db from 'db'

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: {
      id: true,
      osmId: true,
      osmName: true,
      osmAvatar: true,
      osmDescription: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  })

  return user
}
