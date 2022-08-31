import { PrimaryNavigation } from './PrimaryNavigation'
import { SecondaryNavigationDesktop } from './SecondaryNavigationDesktop'

export const Header = () => {
  return (
    <nav className="bg-gray-800 z-20 shadow-xl">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex sm:items-center sm:justify-between sm:flex-row flex-col">
          <PrimaryNavigation />

          <SecondaryNavigationDesktop />
        </div>
      </div>
    </nav>
  )
}
