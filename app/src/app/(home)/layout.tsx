import { Footer } from '../_components/layouts/Footer/Footer'
import { HeaderApp } from '../_components/layouts/Header/HeaderApp/HeaderApp'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <HeaderApp />
      <main className="z-0 flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
