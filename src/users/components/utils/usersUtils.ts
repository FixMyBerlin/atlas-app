import { User } from '@prisma/client'
import { users } from 'src/users/components/users.const'

export const adminIds = users.filter((u) => u.isAdmin).map((u) => u.id)

// MIGRATION: DELETE
export const isAdmin = (user: User) => {
  return adminIds?.includes(user?.id) || false
}

// MIGRATION: DELETE
export const userById = (id: User['id']) => {
  return users.find((u) => u.id === id)
}
