'use client'

import { clsx } from 'clsx'
import type { Route } from 'next'
import NextLink from 'next/link'
import React from 'react'
import { buttonStyles, linkStyles } from './styles'

export type LinkProps<T extends string> = {
  href: Route<T> | URL
  className?: string
  classNameOverwrite?: string
  blank?: boolean
  button?: boolean
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

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

  if (typeof href === 'string' && href.startsWith('http')) {
    console.log('external Link')
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
  console.log('internal Link')
  return (
    <NextLink
      // TODO MIGRATION: Why does this error?
      // @ts-expect-error
      href={href}
      className={classNames}
      {...props}
      {...{ target: blank ? '_blank' : undefined }}
    >
      {children}
    </NextLink>
  )
}
