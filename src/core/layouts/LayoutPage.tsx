import { TailwindResponsiveHelper } from 'src/core/layouts/TailwindResponsiveHelper/TailwindResponsiveHelper'
import React from 'react'
import { Footer } from './Footer'
import { HeaderApp } from './Header'
import { MetaTags } from './MetaTags'

type Props = {
  header?: React.ReactNode
  children?: React.ReactNode
}

export const LayoutPage: React.FC<Props> = ({ header, children }) => {
  const HeaderComponent = header || <HeaderApp />

  return (
    <>
      <MetaTags />

      <div className="relative flex h-full flex-col">
        {HeaderComponent}
        <main className="prose mx-auto my-10 max-w-prose">{children}</main>
        <Footer />
      </div>
      <TailwindResponsiveHelper />
    </>
  )
}
