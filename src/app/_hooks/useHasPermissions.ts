import { useQuery } from '@blitzjs/rpc'

import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import membershipExists from 'src/memberships/queries/membershipExists'
import { useSession } from '@blitzjs/auth'

export const useHasPermissions = () => {
  const session = useSession()
  const regionSlug = useRegionSlug()

  let [membership] = useQuery(
    membershipExists,
    { userId: session.userId || 0, regionSlug: regionSlug || '' },
    { enabled: !!session.userId && session.role !== 'ADMIN' && !!regionSlug },
  )
  if (membership === undefined) membership = false

  return regionSlug ? session.role === 'ADMIN' || membership : null
}
