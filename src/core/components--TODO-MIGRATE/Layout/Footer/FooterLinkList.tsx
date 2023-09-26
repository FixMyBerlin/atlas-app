import { Link } from 'src/core/components--TODO-MIGRATE/Link'
import { clsx } from 'clsx'
import React from 'react'

import { FooterMenuItem } from './footerLinks.const'

type Props = {
  linkList: FooterMenuItem[]
  className?: string
}

export const FooterLinkList: React.FC<Props> = ({ linkList, className }) => {
  return (
    <ul
      className={clsx(
        'flex flex-col space-y-3 text-center sm:flex-row sm:space-y-0 sm:text-left',
        className,
      )}
    >
      {linkList.map((item) => (
        <li key={item.name} className="sm:mr-8">
          <Link
            to={item.to}
            className="block text-base leading-5 text-gray-50 decoration-gray-400 decoration-1 underline-offset-2 hover:!text-white hover:decoration-white"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
