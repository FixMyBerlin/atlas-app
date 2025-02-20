import { CurrentUser } from '@/src/server/users/queries/getCurrentUser'

export const isAdmin = (user: CurrentUser) => {
  if (!user) return false
  return user.role === 'ADMIN'
}
