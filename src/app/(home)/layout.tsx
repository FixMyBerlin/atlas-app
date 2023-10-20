'use client'

import { Footer } from '../_components/layouts/Footer/Footer'
import { HeaderApp } from '../_components/layouts/Header/HeaderApp/HeaderApp'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        About h-screen-layout with Header: https://stackoverflow.com/a/64260554/729221
        About the custom Helmet classes see index.css. We set them here so they do not break our regular content pages.
      */}
      <div className="flex h-screen flex-col">
        <HeaderApp />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  )
}
