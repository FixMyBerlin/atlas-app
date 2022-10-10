import React from 'react'
import { Footer } from './Footer'
import { HeaderApp } from './Header'

type Props = {
  header?: React.ReactNode
  children?: React.ReactNode
}

export const LayoutPage: React.FC<Props> = ({ header, children }) => {
  const headerComponent = header || <HeaderApp />
  return (
    <div className="relative flex h-full flex-col">
      {headerComponent}
      <main className="prose">{children}</main>
      <Footer />
    </div>
  )
}
