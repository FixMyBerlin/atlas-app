import { useRegionSlug } from '@/src/app/regionen/[regionSlug]/_components/regionUtils/useRegionSlug'
import membershipExists from '@/src/memberships/queries/membershipExists'
import { useSession } from '@blitzjs/auth'
import { useQuery } from '@blitzjs/rpc'

export const useHasPermissions = () => {
  const { userId, role } = useSession()
  const regionSlug = useRegionSlug()

  let [membership] = useQuery(
    membershipExists,
    { userId, regionSlug },
    { enabled: Boolean(regionSlug) && Boolean(userId) && role !== 'ADMIN' },
  )

  if (!regionSlug) return false
  if (role === 'ADMIN') return true

  return Boolean(membership)
}
