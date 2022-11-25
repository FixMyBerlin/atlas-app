import classNames from 'classnames'
import React from 'react'
import { Link as ReactLocationLink } from '@tanstack/react-location'

type Props = {
  /** @desc Internal Link, external Link, e-mail-address (will add the `mailto:` automatically) */
  to: string
  classNameOverwrite?: string
  className?: string
  blank?: boolean
  external?: boolean
  button?: boolean
  mailSubject?: string
  mailBody?: string
  title?: string
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const linkStyles =
  'underline decoration-yellow-600 underline-offset-4 hover:decoration-2 active:decoration-2 hover:text-yellow-700 active:text-yellow-700'
export const buttonStyles =
  'inline-flex items-center px-4 py-2 border border-transparent font-semibold rounded-md shadow-sm text-gray-800 bg-brand-yellow hover:bg-yellow-400 group-hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow'

export const Link: React.FC<Props> = ({
  to,
  classNameOverwrite,
  className,
  blank = false,
  external = false,
  button = false,
  mailSubject,
  mailBody,
  children,
  ...props
}) => {
  const classes = classNames(
    className,
    classNameOverwrite || (button ? buttonStyles : linkStyles)
  )

  let mailto: string | undefined = undefined
  if (to.includes('@')) {
    const url = new URL(`mailto:${to}`)
    if (mailSubject) url.searchParams.set('subject', mailSubject)
    if (mailBody) url.searchParams.set('body', mailBody)
    mailto = url.toString()
  }

  type NewWindowProps = {
    target?: string
    rel?: string
  }

  const newWindowProps: NewWindowProps = {
    target: blank ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
  }

  if (external || blank || mailto) {
    return (
      <a href={mailto || to} className={classes} {...newWindowProps} {...props}>
        {children}
      </a>
    )
  }

  return (
    <ReactLocationLink to={to} {...props} className={classes}>
      {children}
    </ReactLocationLink>
  )
}
