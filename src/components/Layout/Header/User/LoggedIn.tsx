import React, { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { UserIcon } from '@heroicons/react/24/solid'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import cn from 'classnames'
import { isAdmin, User } from '@components/MapInterface/UserInfo'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'

type Props = {
  user: User
  hasPermissions: boolean
  onLogout: () => void
}

const LoggedIn: React.FC<Props> = ({ user, hasPermissions, onLogout }) => {
  const { showDebugInfo } = useMapStateInteraction()
  const imgSrc = user.avatar ? user.avatar : null

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="">
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex rounded-full bg-gray-800 text-sm hover:ring-1 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">User-Menü</span>
              {imgSrc ? (
                <img className="h-8 w-8 rounded-full" src={imgSrc} alt="" />
              ) : (
                <UserIcon className="h-6 w-6 text-gray-300" />
              )}
            </Menu.Button>
          </div>
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
                  <strong>Angemeldet als {user.displayName}</strong>
                </p>
                {hasPermissions ? (
                  <div className="flex items-center gap-1 text-xs leading-4">
                    <CheckBadgeIcon className="inline-block h-6 w-6" />
                    <span>Sie sind Mitarbeiter dieser Region</span>
                  </div>
                ) : (
                  <div className="text-xs leading-4">
                    Sie haben zur Zeit keine Zugriffsrechte in dieser Region.
                  </div>
                )}
              </div>
              {isAdmin(user) && showDebugInfo && (
                <div className="bg-pink-300 px-4 py-2 text-sm">
                  OSM ID {user.id}
                </div>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onLogout}
                    className={cn(
                      active ? 'bg-gray-100' : '',
                      'w-full px-4 py-2 text-left text-sm text-gray-700'
                    )}
                  >
                    Ausloggen
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </Disclosure>
  )
}

export default LoggedIn
