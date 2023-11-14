import { useQuery } from '@blitzjs/rpc'

import { useSession } from '@blitzjs/auth'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import membershipExists from 'src/memberships/queries/membershipExists'

export const useHasPermissions = () => {
  const { userId, role } = useSession()
  const regionSlug = useRegionSlug()

  let [membership] = useQuery(
    membershipExists,
    { userId, regionSlug },
    { enabled: Boolean(regionSlug) && Boolean(userId) && role !== 'ADMIN' },
  )

  if (!regionSlug) return null
  if (role === 'ADMIN') return true

  return Boolean(membership)
}
