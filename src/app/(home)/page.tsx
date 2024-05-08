import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { HomePageCallToAction } from './_components/HomePageCallToAction'
import { HomePageCompanies } from './_components/HomePageCompanies'
import { HomePageHero } from './_components/HomePageHero'
import { HomePageLive } from './_components/HomePageLive'
import { HomePagePrimaryFeatures } from './_components/HomePagePrimaryFeatures'
import { HomePageSecondaryFeaturesJustText } from './_components/HomePageSecondaryFeaturesJustText'
import { cookieName } from 'src/users/hooks/cookieName'

export const metadata: Metadata = {} // Using the defaults from src/layout.tsx

export default function Home() {
  const cookieStore = cookies()
  const redirectUrl = cookieStore.get(cookieName)?.value
  if (redirectUrl && redirectUrl !== '/') {
    redirect(redirectUrl)
  }

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
