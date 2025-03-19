import { PrimaryNavigationProps } from '../types'
import { User } from '../User/User'
import { NavigationDesktopLinks } from './NavigationDesktopLinks'
import { NavigationDesktopMenu } from './NavigationDesktopMenu'

type Props = PrimaryNavigationProps & {
  logo: React.ReactElement
  secondaryNavigationLogo: boolean
}

export const NavigationDesktop = ({
  primaryNavigation,
  secondaryNavigation,
  secondaryNavigationLogo,
  logo: Logo,
}: Props) => {
  return (
    <div className="relative z-50 hidden sm:flex sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-h-[4rem] items-center justify-between sm:h-16">
        <div className="flex flex-1 items-center justify-start sm:items-stretch">
          <div className="flex flex-shrink-0 items-center">{Logo}</div>
        </div>
      </div>
      <div className="flex items-center">
        <NavigationDesktopLinks menuItems={primaryNavigation} />
        <User />
        <NavigationDesktopMenu menuItems={secondaryNavigation} logo={secondaryNavigationLogo} />
      </div>
    </div>
  )
}
