import React from 'react'
import { Footer } from './Footer'
import { HeaderApp } from './Header'
import { TailwindResponsiveHelper } from './TailwindResponsiveHelper/TailwindResponsiveHelper'

type Props = {
  children?: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative flex h-full flex-col">
      <HeaderApp />
      <main>{children}</main>
      <Footer />
      <TailwindResponsiveHelper />
    </div>
  )
}