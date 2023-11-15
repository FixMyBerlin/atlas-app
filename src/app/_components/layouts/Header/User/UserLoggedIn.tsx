import { useMutation } from '@blitzjs/rpc'
import { Menu, Transition } from '@headlessui/react'
import { CheckBadgeIcon, UserIcon } from '@heroicons/react/24/solid'
import { clsx } from 'clsx'
import Image from 'next/image'
import { Fragment } from 'react'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { useHasPermissions } from 'src/app/_hooks/useHasPermissions'
import logout from 'src/auth/mutations/logout'
import { isAdmin } from 'src/users/components/utils/usersUtils'
import { CurrentUser } from 'src/users/queries/getCurrentUser'
import { UserLoggedInAdminInfo } from './UserLoggedInAdminInfo'

export type UserLoggedInProp = {
  user: NonNullable<CurrentUser>
}

export const UserLoggedIn = ({ user }: UserLoggedInProp) => {
  const imgSrc = null

  const [logoutMutation] = useMutation(logout)

  const isRegionsPage = Boolean(useRegionSlug())
  const hasPermissions = useHasPermissions()

  return (
    <Menu as="div" className="relative ml-3 sm:ml-6">
      <Menu.Button className="flex rounded-full bg-gray-800 text-sm hover:ring-1 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">User-Menü</span>
        {imgSrc ? (
          <Image
            src={imgSrc}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
            alt=""
            aria-hidden="true"
          />
        ) : (
          <UserIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
            <p className="mb-1">
              <strong>Angemeldet als {user.name}</strong>
            </p>
            {isRegionsPage && hasPermissions === true && !isAdmin(user) && (
              <div className="flex items-center gap-1 text-xs leading-4">
                <CheckBadgeIcon className="inline-block h-6 w-6" />
                <span>Sie sind Mitarbeiter dieser Region</span>
              </div>
            )}
            {isRegionsPage && hasPermissions === false && (
              <div className="text-xs leading-4">
                Sie haben zur Zeit keine Zugriffsrechte in dieser Region.
              </div>
            )}
          </div>

          <UserLoggedInAdminInfo user={user} />

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={async () => {
                  await logoutMutation()
                }}
                className={clsx(
                  active ? 'bg-gray-100' : '',
                  'w-full px-4 py-2 text-left text-sm text-gray-700',
                )}
              >
                Ausloggen
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
