import { Disclosure } from '@headlessui/react'
import classNames from 'classnames'
import React from 'react'
import { primaryNavigation, secondaryNavigationGrouped } from '../menu.const'

// Includes PrimaryNavigation AND SecondaryNavigation Menu Items.
export const MobileMenu: React.FC = () => {
  return (
    <Disclosure.Panel className="sm:hidden divide-y-2 divide-gray-900">
      <div className="space-y-1 pt-2 pb-3">
        {primaryNavigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block px-3 py-2 rounded-md text-base font-medium'
            )}
            aria-current={item.current ? 'page' : undefined}
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
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
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
