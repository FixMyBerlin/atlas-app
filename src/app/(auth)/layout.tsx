import { Metadata } from 'next'
import { Footer } from '../_components/layouts/Footer/Footer'
import { HeaderApp } from '../_components/layouts/Header/HeaderApp/HeaderApp'

export const metadata: Metadata = {
  robots: 'noindex',
}

// TODO MIGRATION: TS Layout hier hin kopieren
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full flex-col">
      <HeaderApp />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
