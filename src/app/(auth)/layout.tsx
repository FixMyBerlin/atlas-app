'use client'

import { Footer } from '../_components/layouts/Footer/Footer'
import { HeaderApp } from '../_components/layouts/Header/HeaderApp/HeaderApp'
import { MetaTags } from '../_components/layouts/MetaTags/MetaTags'

// TODO MIGRATION: TS Layout hier hin kopieren
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MetaTags noindex />

      <div className="relative flex h-full flex-col">
        <HeaderApp />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}
