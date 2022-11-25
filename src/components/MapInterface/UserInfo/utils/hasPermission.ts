import { Region } from '@fakeServer/regions.const'
import { User } from '../useUserStore'

export const hasPermission = (
  currentUser: User | null,
  region: Region | undefined
) => {
  return !!currentUser && !!region
    ? region.osmUsers.includes(currentUser.id)
    : false
}
