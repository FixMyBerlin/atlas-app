import { clsx } from 'clsx'
import { LinkProps, buttonStyles, linkStyles } from './Link'

type Props = {
  className?: string
  tel?: string
  button?: LinkProps['button']
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const LinkTel: React.FC<Props> = ({ className, tel, button, children, ...props }) => {
  const classes = clsx(className || (button ? buttonStyles : linkStyles))

  return (
    <a href={`tel:${tel || children}`} className={classes} {...props}>
      {children}
    </a>
  )
}
