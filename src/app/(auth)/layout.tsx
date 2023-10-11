import { TailwindResponsiveHelper } from 'src/app/_components/layouts/TailwindResponsiveHelper/TailwindResponsiveHelper'
import { HeaderApp } from '../_components/layouts/Header/HeaderApp/HeaderApp'
import { Footer } from '../_components/layouts/Footer/Footer'

// TODO MIGRATION: TS Layout hier hin kopieren
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex h-full flex-col">
        <HeaderApp />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}
