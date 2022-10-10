import { NavigationScaffold } from '../components'
import { PrimaryNavigation } from '../components/PrimaryNavigation'
import { SecondaryNavigationDesktop } from '../SecondaryNavigationDesktop'
import { HeaderAppLogo } from './HeaderAppLogo'
import { primaryNavigation } from './primaryNavigation.const'

export const HeaderApp = () => {
  return (
    <nav className="z-20 bg-gray-800 shadow-xl">
      <div className="mx-auto px-2 sm:px-6 lg:pl-5 lg:pr-2.5">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <NavigationScaffold
            logo={<HeaderAppLogo />}
            primaryNavigation={primaryNavigation}
          />
          <div className="flex items-center">
            <PrimaryNavigation primaryNavigation={primaryNavigation} />
            <SecondaryNavigationDesktop />
          </div>
        </div>
      </div>
    </nav>
  )
}
