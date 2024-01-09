import { HeaderRegionen } from '../../_components/layouts/Header/HeaderRegionen/HeaderRegionen'

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <HeaderRegionen />
      <main className="z-0 flex-grow">{children}</main>
    </div>
  )
}
