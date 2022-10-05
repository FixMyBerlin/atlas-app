import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMatchRoute } from '@tanstack/react-location'
import classNames from 'classnames'
import React, { Fragment } from 'react'
import { MobileMenu } from './MobileMenu'
import { PrimaryNavigationProps } from './types'

type Props = PrimaryNavigationProps & {
  logo: React.ReactElement
}

export const PrimaryNavigation: React.FC<Props> = ({
  primaryNavigation,
  logo: Logo,
}) => {
  const matchRoute = useMatchRoute()

  return (
    <Disclosure as={Fragment}>
      {({ open }) => (
        <>
          <div className="relative flex min-h-[4rem] items-center justify-between sm:h-16">
            {/* Mobile: Menü Button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Hauptmenü öffnen</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              {/* Logo */}
              <div className="flex flex-shrink-0 items-center">{Logo}</div>
              {/* Desktop: Menu (Line) */}
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {primaryNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        matchRoute({ to: item.href })
                          ? 'cursor-default bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      aria-current={
                        matchRoute({ to: item.href }) ? 'page' : undefined
                      }
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <MobileMenu primaryNavigation={primaryNavigation} />
        </>
      )}
    </Disclosure>
  )
}
