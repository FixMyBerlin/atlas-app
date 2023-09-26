import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { PrimaryNavigationProps } from '../types'

type Props = {
  menuItems: PrimaryNavigationProps['secondaryNavigation']
}

export const NavigationDesktopMenu: React.FC<Props> = ({ menuItems }) => {
  const { pathname } = useRouter()

  return (
    <Menu as={Fragment}>
      {({ open }) => (
        <>
          <div className="static inset-auto pr-0">
            <div className="relative ml-3">
              <Menu.Button className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Sekundärmenü öffnen</span>
                {open ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
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
                <Menu as={Fragment}>
                  <Menu.Items
                    static
                    className="absolute right-0 mt-1 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {menuItems.map((group, i) => {
                      return (
                        <div className="px-1 py-1" key={i}>
                          {group.map((item, gi) => {
                            const current = item.href === pathname
                            return (
                              <Menu.Item key={gi}>
                                {({ active }) => (
                                  <Link
                                    href={item.href}
                                    className={clsx(
                                      active ? 'bg-gray-100' : '',
                                      current ? 'bg-gray-200' : '',
                                      'block px-4 py-2 text-sm text-gray-700',
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            )
                          })}
                        </div>
                      )
                    })}
                  </Menu.Items>
                </Menu>
              </Transition>
            </div>
          </div>
        </>
      )}
    </Menu>
  )
}
