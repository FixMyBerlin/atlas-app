import { User } from 'db'
import { users } from 'src/users/components/users.const'

export const adminIds = users.filter((u) => u.isAdmin).map((u) => u.id)

export const isAdmin = (user: User) => {
  return user.role === 'ADMIN'
}

// MIGRATION: DELETE
export const userById = (id: User['id']) => {
  return users.find((u) => u.id === id)
}
