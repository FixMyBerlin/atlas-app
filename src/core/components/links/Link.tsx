import { RouteUrlObject } from 'blitz'
import { clsx } from 'clsx'
import NextLink from 'next/link'
import React, { forwardRef } from 'react'
import { UrlObject } from 'url'

export type LinkProps = {
  href: RouteUrlObject | UrlObject | string
  className?: string
  classNameOverwrite?: string
  blank?: boolean
  external?: boolean
  button?: boolean
  mailSubject?: string
  mailBody?: string
  title?: string
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export const linkStyles =
  'underline decoration-yellow-600 underline-offset-4 hover:decoration-2 active:decoration-2 hover:text-yellow-700 active:text-yellow-700'
export const buttonStyles =
  'inline-flex items-center px-4 py-2 border border-transparent font-semibold rounded-md shadow-sm text-gray-800 bg-yellow-50 hover:bg-yellow-400 group-hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-50 select-none'

export const Link: React.FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      className,
      classNameOverwrite,
      blank = false,
      external = false,
      button = false,
      mailSubject,
      mailBody,
      children,
      ...props
    },
    ref,
  ) => {
    const classNames = clsx(className, classNameOverwrite || (button ? buttonStyles : linkStyles))

    // external link
    if (typeof href === 'string') {
      return (
        <a
          ref={ref}
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
      <NextLink
        href={href}
        ref={ref}
        className={classNames}
        {...props}
        {...{ target: blank ? '_blank' : undefined }}
      >
        {children}
      </NextLink>
    )
  },
)
