'use client'
import { useStaticRegion } from '@/src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { RenderIfNotDoNotNavigate } from '../../RenderIfNotDoNotNavigate'
import { NavigationDesktop } from '../NavigationDesktop/NavigationDesktop'
import { NavigationMobile } from '../NavigationMobile/NavigationMobile'
import { NavigationWrapper } from '../NavigationWrapper/NavigationWrapper'
import { HeaderRegionenLogo } from './HeaderRegionenLogo'
import { defaultPrimaryNavigation, defaultSecondaryNavigationGrouped } from './navigation.const'

export const HeaderRegionen = () => {
  const region = useStaticRegion()
  const primaryNavigation = [...defaultPrimaryNavigation, ...(region?.navigationLinks || [])]
  return (
    <NavigationWrapper>
      <RenderIfNotDoNotNavigate>
        <NavigationMobile
          logo={<HeaderRegionenLogo />}
          primaryNavigation={primaryNavigation}
          secondaryNavigation={defaultSecondaryNavigationGrouped}
        />
        <NavigationDesktop
          logo={<HeaderRegionenLogo />}
          primaryNavigation={primaryNavigation}
          secondaryNavigation={defaultSecondaryNavigationGrouped}
        />
      </RenderIfNotDoNotNavigate>
    </NavigationWrapper>
  )
}
