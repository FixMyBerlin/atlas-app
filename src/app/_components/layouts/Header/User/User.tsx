import React from 'react'
import { useRouter } from 'next/navigation'

import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { UserIcon } from '@heroicons/react/24/outline'
import { additionalRegionAttributes } from 'src/regions/components/additionalRegionAttributes.const'
import { hasPermission } from 'src/app/regionen/_components/MapInterface/UserInfo/utils/hasPermission'
// import { useUserStore } from 'src/app/regionen/_components/MapInterface/UserInfo/useUserStore' TODO: remove
import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import { useMutation } from '@blitzjs/rpc'
import logout from 'src/auth/mutations/logout'
import { TRegion } from 'src/regions/queries/getPublicRegion'
import { LoggedIn } from './LoggedIn'

export const User: React.FC = () => {
  const user = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  const regionSlug = useRegionSlug()
  // TODO MIGRATION: Get rid of the casting
  const region = additionalRegionAttributes.find((r) => r.slug === regionSlug) as TRegion
  // const hasPermissions = region ? hasPermission(user, region) || false : false
  // TODO: make this work
  const hasPermissions = false

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
