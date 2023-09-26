import { Region } from 'src/regions/components/regions.const'
import { User } from '../useUserStore'
import { users } from 'src/users/components/users.const'

export const hasPermission = (currentUser: User | null, region: Region | undefined) => {
  return !!currentUser && !!region ? region.osmUsers.includes(currentUser.id) : false
}

export const hasPermissionByDisplayName = (
  userDisplayName: User['displayName'] | null | undefined,
  region: Region | undefined,
) => {
  if (!region) return false
  if (!userDisplayName) return false

  const regionUserDisplaynames = region.osmUsers
    .map((userId) => users.find((u) => u.id === userId)?.displayName)
    .filter((item): item is string => !!item)

  return regionUserDisplaynames.includes(userDisplayName) || false
}
