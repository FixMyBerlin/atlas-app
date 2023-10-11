'use client'

import { TailwindResponsiveHelper } from 'src/app/_components/layouts/TailwindResponsiveHelper/TailwindResponsiveHelper'
import { HeaderRegionen } from '../_components/layouts/Header/HeaderRegionen/HeaderRegionen'

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        About h-screen-layout with Header: https://stackoverflow.com/a/64260554/729221
        About the custom Helmet classes see index.css. We set them here so they do not break our regular content pages.
      */}
      <div className="flex h-screen flex-col">
        <HeaderRegionen />
        <main className="flex-grow">{children}</main>
      </div>
    </>
  )
}
