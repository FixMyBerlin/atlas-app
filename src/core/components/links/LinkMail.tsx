import { clsx } from 'clsx'
import { LinkProps, buttonStyles, linkStyles } from './Link'

type Props = {
  className?: string
  mailto?: string
  subject?: string
  body?: string
  button?: LinkProps['button']
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const LinkMail: React.FC<Props> = ({
  className,
  mailto,
  subject,
  body,
  button,
  children,
  ...props
}) => {
  const classes = clsx(className || (button ? buttonStyles : linkStyles))

  const url = new URL(`mailto:${mailto || children}`)
  if (subject) {
    url.searchParams.append('subject', subject)
  }
  if (body) {
    url.searchParams.append('body', body)
  }

  return (
    <a href={url.href} className={classes} {...props}>
      {children}
    </a>
  )
}
