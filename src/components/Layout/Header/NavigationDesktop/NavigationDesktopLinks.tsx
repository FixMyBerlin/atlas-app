import { LocationGenerics } from '@routes/routes'
import { Link, useMatch, useMatchRoute } from '@tanstack/react-location'
import clsx from 'clsx'
import React from 'react'
import { PrimaryNavigationProps } from '../types'

type Props = {
  menuItems: PrimaryNavigationProps['primaryNavigation']
}

export const NavigationDesktopLinks: React.FC<Props> = ({ menuItems }) => {
  const matchRoute = useMatchRoute()
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  return (
    <div className="flex space-x-4">
      {menuItems.map((item) => {
        const routeWithRegion = item.href.replaceAll(':regionPath', region?.path || '')
        return (
          <Link
            key={item.name}
            to={routeWithRegion}
            className={clsx(
              matchRoute({ to: item.href })
                ? 'cursor-default bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'rounded-md px-3 py-2 text-sm font-medium',
            )}
            aria-current={matchRoute({ to: item.href }) ? 'page' : undefined}
          >
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}
