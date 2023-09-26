import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { PrimaryNavigationProps } from '../types'
import { useRouter } from 'next/router'

type Props = {
  menuItems: PrimaryNavigationProps['primaryNavigation']
}

export const NavigationDesktopLinks: React.FC<Props> = ({ menuItems }) => {
  const { pathname } = useRouter()

  return (
    <div className="flex space-x-4">
      {menuItems.map((item) => {
        const current = item.href === pathname
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              current
                ? 'cursor-default bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'rounded-md px-3 py-2 text-sm font-medium',
            )}
            aria-current={current ? 'page' : undefined}
          >
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}
