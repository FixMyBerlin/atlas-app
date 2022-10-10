import { useMatchRoute, Link } from '@tanstack/react-location'
import classNames from 'classnames'
import React from 'react'
import { PrimaryNavigationProps } from './types'

type Props = PrimaryNavigationProps

export const PrimaryNavigation: React.FC<Props> = ({ primaryNavigation }) => {
  const matchRoute = useMatchRoute()

  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4">
        {primaryNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={classNames(
              matchRoute({ to: item.href })
                ? 'cursor-default bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'rounded-md px-3 py-2 text-sm font-medium'
            )}
            aria-current={matchRoute({ to: item.href }) ? 'page' : undefined}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
