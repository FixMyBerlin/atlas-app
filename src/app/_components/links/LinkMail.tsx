'use client'

import { clsx } from 'clsx'
import { LinkProps } from './Link'
import { buttonStyles, linkStyles } from './styles'

type Props = {
  className?: string
  classNameOverwrite?: string
  mailto?: string
  subject?: string
  body?: string
  button?: boolean
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const LinkMail: React.FC<Props> = ({
  className,
  classNameOverwrite,
  mailto,
  subject,
  body,
  button,
  children,
  ...props
}) => {
  const classNames = clsx(className, classNameOverwrite || (button ? buttonStyles : linkStyles))

  const url = new URL(`mailto:${mailto || children}`)
  if (subject) {
    url.searchParams.append('subject', subject)
  }
  if (body) {
    url.searchParams.append('body', body)
  }

  return (
    <a href={url.href} className={classNames} {...props}>
      {children}
    </a>
  )
}
