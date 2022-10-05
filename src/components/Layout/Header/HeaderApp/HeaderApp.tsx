import { PrimaryNavigation } from '../PrimaryNavigation'
import { SecondaryNavigationDesktop } from '../SecondaryNavigationDesktop'
import { HeaderAppLogo } from './HeaderAppLogo'
import { primaryNavigation } from './primaryNavigation.const'

export const HeaderApp = () => {
  return (
    <nav className="z-20 bg-gray-800 shadow-xl">
      <div className="mx-auto px-2 sm:px-6 lg:pl-5 lg:pr-2.5">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <PrimaryNavigation
            logo={<HeaderAppLogo />}
            primaryNavigation={primaryNavigation}
          />

          <SecondaryNavigationDesktop />
        </div>
      </div>
    </nav>
  )
}
