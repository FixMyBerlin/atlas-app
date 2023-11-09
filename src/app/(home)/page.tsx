import { Metadata } from 'next'
import { HomePageCallToAction } from './_components/HomePageCallToAction'
import { HomePageCompanies } from './_components/HomePageCompanies'
import { HomePageHero } from './_components/HomePageHero'
import { HomePageLive } from './_components/HomePageLive'
import { HomePagePrimaryFeatures } from './_components/HomePagePrimaryFeatures'
import { HomePageSecondaryFeaturesJustText } from './_components/HomePageSecondaryFeaturesJustText'
import { ClientEnv } from './_components/ClientEnv'

export const metadata: Metadata = {} // Using the defaults from src/layout.tsx

export default function Home() {
  return (
    <>
      <ClientEnv/>
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
