'use client'

import { HomePageCallToAction } from './_components/HomePageCallToAction'
import { HomePageCompanies } from './_components/HomePageCompanies'
import { HomePageHero } from './_components/HomePageHero'
import { HomePageLive } from './_components/HomePageLive'
import { HomePagePrimaryFeatures } from './_components/HomePagePrimaryFeatures'
import { HomePageSecondaryFeaturesJustText } from './_components/HomePageSecondaryFeaturesJustText'

// TODO: use react-helmet
// export const metadata: Metadata = {
//   title: 'Radverkehrsatlas – Daten für die Radverkehrsplanung',
//   description:
//     'Der Radverkehrsatlas beschleunigt die kommunale Radverkehrsplanung, mit umfassenden und amtlich nutzbaren Daten für die Radverkehrsplanung.',
// }

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
