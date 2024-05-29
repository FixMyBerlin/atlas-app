import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import React from 'react'
import { twJoin } from 'tailwind-merge'
import { User } from '../User/User'
import { PrimaryNavigationProps } from '../types'

type Props = PrimaryNavigationProps & {
  logo: React.ReactElement
}

export const NavigationMobile: React.FC<Props> = ({
  primaryNavigation,
  secondaryNavigation,
  logo: Logo,
}) => {
  const pathname = usePathname()

  return (
    <Disclosure as="div" className="flex flex-col sm:hidden">
      {({ open }) => (
        <>
          <div className="relative flex min-h-[4rem] items-center justify-between sm:h-16">
            <div className="absolute inset-y-0 right-0 flex items-center space-x-2">
              <User />
              <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Hauptmenü öffnen</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-start sm:items-stretch">
              <div className="flex flex-shrink-0 items-center">{Logo}</div>
            </div>
          </div>

          <DisclosurePanel className="divide-y-2 divide-gray-900">
            <div className="space-y-1 pb-3 pt-2">
              {primaryNavigation.map((item) => {
                const current = item.href === pathname
                return (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={twJoin(
                      current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                    aria-current={current ? 'page' : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                )
              })}
            </div>

            {secondaryNavigation.map((group, i) => {
              return (
                <div key={i} className="space-y-1 pb-3 pt-2">
                  {group.map((item) => {
                    const current = item.href === pathname
                    return (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={twJoin(
                          current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium',
                        )}
                        aria-current={current ? 'page' : undefined}
                      >
                        {item.name}
                      </DisclosureButton>
                    )
                  })}
                </div>
              )
            })}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
