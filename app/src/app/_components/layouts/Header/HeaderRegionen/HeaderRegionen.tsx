'use client'
import { RenderIfNotDoNotNavigate } from '../../RenderIfNotDoNotNavigate'
import { NavigationDesktop } from '../NavigationDesktop/NavigationDesktop'
import { NavigationMobile } from '../NavigationMobile/NavigationMobile'
import { NavigationWrapper } from '../NavigationWrapper/NavigationWrapper'
import { HeaderRegionenLogo } from './HeaderRegionenLogo'
import { primaryNavigation, secondaryNavigationGrouped } from './navigation.const'

export const HeaderRegionen = () => {
  return (
    <NavigationWrapper>
      <RenderIfNotDoNotNavigate>
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
      </RenderIfNotDoNotNavigate>
    </NavigationWrapper>
  )
}
