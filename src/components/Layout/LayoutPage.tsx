import React from 'react'
import { Footer } from './Footer'
import { HeaderApp } from './Header'

type Props = {
  header?: React.ReactNode
  children?: React.ReactNode
}

export const LayoutPage: React.FC<Props> = ({ header, children }) => {
  const HeaderComponent = header || <HeaderApp />

  return (
    <div className="relative flex h-full flex-col">
      {HeaderComponent}
      <main className="prose mx-auto my-10 max-w-prose">{children}</main>
      <Footer />
    </div>
  )
}
