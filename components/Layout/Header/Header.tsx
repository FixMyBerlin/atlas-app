import { PrimaryNavigation } from './PrimaryNavigation'
import { SecondaryNavigationDesktop } from './SecondaryNavigationDesktop'

export const Header = () => {
  return (
    <nav className="z-20 bg-gray-800 shadow-xl">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <PrimaryNavigation />

          <SecondaryNavigationDesktop />
        </div>
      </div>
    </nav>
  )
}
