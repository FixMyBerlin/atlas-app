import React from 'react'
import { useRouter } from 'next/navigation'

import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { UserIcon } from '@heroicons/react/24/outline'
// import { hasPermission } from 'src/app/regionen/_components/MapInterface/UserInfo/utils/hasPermission' TODO: remove
// import { useUserStore } from 'src/app/regionen/_components/MapInterface/UserInfo/useUserStore' TODO: remove
import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import { useQuery, useMutation } from '@blitzjs/rpc'
import membershipExists from 'src/memberships/queries/membershipExists'
import logout from 'src/auth/mutations/logout'
import { LoggedIn } from './LoggedIn'

export const User: React.FC = () => {
  const user = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  const regionSlug = useRegionSlug()
  let [membership] = useQuery(
    membershipExists,
    { userId: user?.id || 0, regionSlug: regionSlug || '' },
    { enabled: !!user && user.role !== 'ADMIN' && !!regionSlug },
  )
  if (membership === undefined) membership = false

  const hasPermissions = regionSlug ? user?.role === 'ADMIN' || membership : null

  return (
    <div className="sm:ml-6">
      {user === null ? (
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:border sm:border-gray-700"
          onClick={() => void router.push('/login')}
        >
          <span className="sr-only">Anmelden</span>
          <UserIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      ) : (
        <LoggedIn
          user={user}
          hasPermissions={hasPermissions}
          onLogout={async () => {
            await logoutMutation()
          }}
        />
      )}
    </div>
  )
}
