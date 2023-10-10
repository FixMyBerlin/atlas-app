'use client'

import { clsx } from 'clsx'
import { LinkProps, buttonStyles, linkStyles } from './Link'

type Props = {
  className?: string
  classNameOverwrite?: string
  tel?: string
  button?: LinkProps['button']
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const LinkTel: React.FC<Props> = ({
  className,
  classNameOverwrite,
  tel,
  button,
  children,
  ...props
}) => {
  const classNames = clsx(className, classNameOverwrite || (button ? buttonStyles : linkStyles))

  return (
    <a href={`tel:${tel || children}`} className={classNames} {...props}>
      {children}
    </a>
  )
}
