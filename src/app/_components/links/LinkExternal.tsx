'use client'

import { RouteUrlObject } from 'blitz'
import { clsx } from 'clsx'
import type { Route } from 'next'
import NextLink from 'next/link'
import React, { forwardRef } from 'react'
import { UrlObject } from 'url'
import { buttonStyles, linkStyles } from './Link'

export type LinkProps = {
  className?: string
  classNameOverwrite?: string
  blank?: boolean
  button?: boolean
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export function ExternalLink({
  href,
  className,
  classNameOverwrite,
  blank = false,
  button = false,
  children,
  ...props
}: LinkProps) {
  const classNames = clsx(className, classNameOverwrite || (button ? buttonStyles : linkStyles))

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
