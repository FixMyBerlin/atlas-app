import { useMutation } from '@blitzjs/rpc'
import { UserIcon } from '@heroicons/react/24/outline'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useHasPermissions } from 'src/app/_hooks/useHasPermissions'
import logout from 'src/auth/mutations/logout'
import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import { LoggedIn } from './LoggedIn'

export const User: React.FC = () => {
  const user = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()
  const hasPermissions = useHasPermissions()
  const loginUrl = `/login?next=${encodeURIComponent(
    `${location.pathname}${location.search}`,
  ).toString()}` as Route

  return (
    <div className="sm:ml-6">
      {user === null ? (
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:border sm:border-gray-700"
          onClick={() => void router.push(loginUrl)}
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
