import React from 'react'
import { MetaTags } from 'src/core/layouts/MetaTags'
import { TailwindResponsiveHelper } from 'src/core/layouts/TailwindResponsiveHelper/TailwindResponsiveHelper'
import { HeaderRegionen } from './Header'
import Head from 'next/head'

type Props = {
  children?: React.ReactNode
}

// About h-screen-layout with Header: https://stackoverflow.com/a/64260554/729221
// About the custom Helmet classes see index.css. We set them here so they do not break our regular content pages.
export const LayoutMap: React.FC<Props> = ({ children }) => {
  return (
    <>
      <MetaTags noindex />

      <div className="flex h-screen flex-col">
        <HeaderRegionen />
        <main className="flex-grow">{children}</main>
      </div>

      <TailwindResponsiveHelper />
    </>
  )
}
