import { osmUserAdmins } from '@fakeServer/regions.const'
import { User } from '../useUserStore'

export const isAdmin = (currentUser: User) => {
  return osmUserAdmins?.includes(currentUser?.id) || false
}
