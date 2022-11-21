import { User } from '@components/MapInterface/UserInfo'
import { users } from '@fakeServer/users.const'

export const adminIds = users.filter((u) => u.isAdmin).map((u) => u.id)

export const isAdmin = (user: User) => {
  return adminIds?.includes(user?.id) || false
}

export const userById = (id: User['id']) => {
  return users.find((u) => u.id === id)
}
