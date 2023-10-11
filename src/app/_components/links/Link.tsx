'use client'

import { clsx } from 'clsx'
import type { Route } from 'next'
import NextLink from 'next/link'
import React from 'react'

export type LinkProps<T extends string> = {
  href: Route<T> | URL
  className?: string
  classNameOverwrite?: string
  blank?: boolean
  button?: boolean
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export const linkStyles =
  'underline decoration-yellow-600 underline-offset-4 hover:decoration-2 active:decoration-2 hover:text-yellow-700 active:text-yellow-700'
export const buttonStyles =
  'inline-flex items-center px-4 py-2 border border-transparent font-semibold rounded-md shadow-sm text-gray-800 bg-yellow-50 hover:bg-yellow-400 group-hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-50 select-none'

export function Link<T extends string>({
  href,
  className,
  classNameOverwrite,
  blank = false,
  button = false,
  children,
  ...props
}: LinkProps<T>) {
  const classNames = clsx(className, classNameOverwrite || (button ? buttonStyles : linkStyles))

  return (
    <NextLink
      href={href}
      className={classNames}
      {...props}
      {...{ target: blank ? '_blank' : undefined }}
    >
      {children}
    </NextLink>
  )
}
