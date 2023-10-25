'use client'

import { HomePageCallToAction } from './_components/HomePageCallToAction'
import { HomePageCompanies } from './_components/HomePageCompanies'
import { HomePageHero } from './_components/HomePageHero'
import { HomePageLive } from './_components/HomePageLive'
import { HomePagePrimaryFeatures } from './_components/HomePagePrimaryFeatures'
import { HomePageSecondaryFeaturesJustText } from './_components/HomePageSecondaryFeaturesJustText'

export default function Home() {
  return (
    <>
      <HomePageHero />
      <HomePageCompanies />
      <HomePagePrimaryFeatures />
      {/* <HomePageSecondaryFeatures /> */}
      <HomePageSecondaryFeaturesJustText />
      <HomePageCallToAction />
      {/* <HomePageTestimonials /> */}
      <HomePageLive />
    </>
  )
}
