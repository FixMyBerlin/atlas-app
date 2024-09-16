'use client'

import { HomeIcon } from '@heroicons/react/20/solid'
import { Route } from 'next'
import { usePathname } from 'next/navigation'
import { twJoin } from 'tailwind-merge'

export type TBreadcrumb = { href: Route; name: string }
type Props = { pages: TBreadcrumb[] }

export const Breadcrumb = ({ pages }: Props) => {
  const pathname = usePathname()

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="my-0 flex space-x-4 rounded-md bg-white px-6 shadow">
        <li className="flex">
          <div className="flex items-center">
            <a href="/admin" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Admin</span>
            </a>
          </div>
        </li>

        {pages.map((page) => {
          const current = pathname === page.href

          return (
            <li key={page.name} className="flex">
              <div className="flex items-center">
                <svg
                  className="h-full w-6 flex-shrink-0 text-gray-200"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
                <a
                  href={page.href}
                  aria-disabled={current ? 'true' : undefined}
                  className={twJoin(
                    current
                      ? 'pointer-events-none font-semibold text-gray-800'
                      : 'text-gray-500 hover:text-gray-700',
                    'ml-4 text-sm font-medium',
                  )}
                  aria-current={current ? 'page' : undefined}
                >
                  {page.name}
                </a>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
