import React, { ReactNode } from 'react'
import { Logo } from '~/components/Layout/Logo'

type Props = {
  title: string
  children: ReactNode
}

// TODO: Maybe we need to prevent the layout from unmounting, see https://www.gatsbyjs.com/docs/how-to/routing/layout-components/#how-to-prevent-layout-components-from-unmounting
export const Hero: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="from-lemon-yellow to-lime-green px-layout bg-gradient-to-b pt-20">
      <Logo />
      <h1 className="py-8 text-2xl font-medium">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  )
}
