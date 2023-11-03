import { TRegion } from 'src/regions/queries/getPublicRegion'
import { users } from 'src/users/components/users.const'
import { type User } from '../useUserStore'

export const hasPermissionByDisplayName = (
  userDisplayName: User['displayName'] | null | undefined,
  region: TRegion | undefined,
) => {
  if (!region) return false
  if (!userDisplayName) return false

  const regionUserDisplaynames = region.osmUsers
    ?.map((userId) => users.find((u) => u.id === userId)?.displayName)
    ?.filter((item): item is string => !!item)

  return regionUserDisplaynames?.includes(userDisplayName) || false
}
