import { Footer } from '../_components/layouts/Footer/Footer'
import { HeaderApp } from '../_components/layouts/Header/HeaderApp/HeaderApp'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <HeaderApp />
      <main className="prose mx-auto my-10 max-w-prose">{children}</main>
      <Footer />
    </div>
  )
}
