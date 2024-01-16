import { twJoin } from 'tailwind-merge'
import type { Route } from 'next'
import React from 'react'
import { Link } from './Link'
import { buttonStyles, linkStyles } from './styles'

export type LinkProps<T extends string> = {
  href: Route<T> | string
  className?: string
  classNameOverwrite?: string
  blank?: boolean
  button?: boolean
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export function LinkExternal<T extends string>({
  href,
  className,
  classNameOverwrite,
  blank = false,
  button = false,
  children,
  ...props
}: LinkProps<T>) {
  const classNames = twJoin(className, classNameOverwrite || (button ? buttonStyles : linkStyles))

  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        className={classNames}
        rel="noopener noreferrer"
        {...{ target: blank ? '_blank' : undefined }}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      // TS: The component should only be used for external links. We keep the <Link> as a fallback and expect those to be internal NextJS links.
      href={href as Route<T>}
      className={className}
      classNameOverwrite={classNameOverwrite}
      blank={blank}
      button={button}
      {...props}
    >
      {children}
    </Link>
  )
}
