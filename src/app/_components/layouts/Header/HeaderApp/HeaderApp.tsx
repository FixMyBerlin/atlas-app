'use client'

import { NavigationDesktop } from '../NavigationDesktop/NavigationDesktop'
import { NavigationMobile } from '../NavigationMobile/NavigationMobile'
import { NavigationWrapper } from '../NavigationWrapper/NavigationWrapper'
import { HeaderAppLogo } from './HeaderAppLogo'
import { primaryNavigation, secondaryNavigationGrouped } from './navigation.const'

export const HeaderApp = () => {
  return (
    <NavigationWrapper>
      <NavigationMobile
        logo={<HeaderAppLogo />}
        primaryNavigation={primaryNavigation}
        secondaryNavigation={secondaryNavigationGrouped}
      />
      <NavigationDesktop
        logo={<HeaderAppLogo />}
        primaryNavigation={primaryNavigation}
        secondaryNavigation={secondaryNavigationGrouped}
      />
    </NavigationWrapper>
  )
}
