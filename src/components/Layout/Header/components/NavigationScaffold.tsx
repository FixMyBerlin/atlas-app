import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { Fragment } from 'react'
import { MobileMenu } from './MobileMenu'
import { PrimaryNavigationProps } from './types'

type Props = PrimaryNavigationProps & {
  logo: React.ReactElement
}

export const NavigationScaffold: React.FC<Props> = ({
  primaryNavigation,
  logo: Logo,
}) => {
  return (
    <Disclosure as={Fragment}>
      {({ open }) => (
        <>
          <div className="relative flex min-h-[4rem] items-center justify-between sm:h-16">
            {/* Mobile: Menü Button */}
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Hauptmenü öffnen</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-start sm:items-stretch">
              {/* Logo */}
              <div className="flex flex-shrink-0 items-center">{Logo}</div>
            </div>
          </div>

          <MobileMenu primaryNavigation={primaryNavigation} />
        </>
      )}
    </Disclosure>
  )
}
