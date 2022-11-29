import { Disclosure } from '@headlessui/react'
import { useMatchRoute } from '@tanstack/react-location'
import { clsx } from 'clsx'
import React from 'react'
import { secondaryNavigationGrouped } from '../secondaryNavigation.const'
import { PrimaryNavigationProps } from './types'

// Includes PrimaryNavigation AND SecondaryNavigation Menu Items.
export const MobileMenu: React.FC<PrimaryNavigationProps> = ({
  primaryNavigation,
}) => {
  const matchRoute = useMatchRoute()

  return (
    <Disclosure.Panel className="divide-y-2 divide-gray-900 sm:hidden">
      <div className="space-y-1 pt-2 pb-3">
        {primaryNavigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className={clsx(
              matchRoute({ to: item.href })
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium'
            )}
            aria-current={matchRoute({ to: item.href }) ? 'page' : undefined}
          >
            {item.name}
          </Disclosure.Button>
        ))}
      </div>

      {secondaryNavigationGrouped.map((group, i) => {
        return (
          <div key={i} className="space-y-1 pt-2 pb-3">
            {group.map((item) => {
              return (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={clsx(
                    matchRoute({ to: item.href })
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={
                    matchRoute({ to: item.href }) ? 'page' : undefined
                  }
                >
                  {item.name}
                </Disclosure.Button>
              )
            })}
          </div>
        )
      })}
    </Disclosure.Panel>
  )
}
