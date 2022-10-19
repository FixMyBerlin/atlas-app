// based on https://tailwindui.com/components/application-ui/navigation/navbars

import React, { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import cn from 'classnames'

interface Props {
  user: User
  hasPermissions: boolean
  onLogout: () => void
}

// TODO: import type User from '@components/MapInterface/UserInfo/useUserStore'
interface User {
  id: number
  displayName: string
  avatar: null | string
}

const LoggedIn: React.FC<Props> = ({ user, hasPermissions, onLogout }) => {
  const imgSrc = user.avatar ? user.avatar : null
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="">
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">Open user menu</span>
              {imgSrc ? (
                <img className="h-8 w-8 rounded-full" src={imgSrc} alt="" />
              ) : (
                <UserCircleIcon className="h-9 w-9 text-gray-300" />
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                <div className={'block px-4 py-2 text-sm text-gray-700'}>
                  {user.displayName}
                  {hasPermissions && (
                    <>
                      &nbsp;
                      <CheckBadgeIcon className="inline-block h-6 w-6"></CheckBadgeIcon>
                    </>
                  )}
                </div>
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onLogout}
                    className={cn(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
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
