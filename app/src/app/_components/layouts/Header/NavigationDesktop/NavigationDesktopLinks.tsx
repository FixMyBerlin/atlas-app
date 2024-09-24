import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twJoin } from 'tailwind-merge'
import { PrimaryNavigationProps } from '../types'

type Props = {
  menuItems: PrimaryNavigationProps['primaryNavigation']
}

export const NavigationDesktopLinks = ({ menuItems }: Props) => {
  const pathname = usePathname()

  return (
    <div className="flex space-x-4">
      {menuItems.map((item) => {
        const current = item.href === pathname
        return (
          <Link
            key={item.name}
            href={item.href}
            className={twJoin(
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
