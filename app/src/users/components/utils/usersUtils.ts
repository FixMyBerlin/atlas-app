import { User } from '@/db'
import { users } from '@/src/users/components/users.const'
import { CurrentUser } from '@/src/users/queries/getCurrentUser'

export const adminIds = users.filter((u) => u.isAdmin).map((u) => u.id)

export const isAdmin = (user: CurrentUser) => {
  if (!user) return false
  return user.role === 'ADMIN'
}

// MIGRATION: DELETE
export const userById = (id: User['id']) => {
  return users.find((u) => u.id === id)
}
