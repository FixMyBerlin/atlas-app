import { NavigationDesktop } from '../NavigationDesktop'
import { NavigationMobile } from '../NavigationMobile'
import { NavigationWrapper } from '../NavigationWrapper'
import { HeaderRegionenLogo } from './HeaderRegionenLogo'
import { primaryNavigation, secondaryNavigationGrouped } from './navigation.const'

export const HeaderRegionen = () => {
  return (
    <NavigationWrapper>
      <NavigationMobile
        logo={<HeaderRegionenLogo />}
        primaryNavigation={primaryNavigation}
        secondaryNavigation={secondaryNavigationGrouped}
      />
      <NavigationDesktop
        logo={<HeaderRegionenLogo />}
        primaryNavigation={primaryNavigation}
        secondaryNavigation={secondaryNavigationGrouped}
      />
    </NavigationWrapper>
  )
}
