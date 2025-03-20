import { cookieName } from '@/src/server/auth/cookieName.const'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { HomePageHero } from './_components/HomePageHero'
import { HomePageLive } from './_components/HomePageLive'

export const metadata: Metadata = {} // Using the defaults from src/layout.tsx

export default function Homepage() {
  const cookieStore = cookies()
  const redirectUrl = cookieStore.get(cookieName)?.value
  if (redirectUrl && redirectUrl !== '/') {
    redirect(redirectUrl)
  }

  return (
    <>
      <HomePageHero />
      <HomePageLive />
    </>
  )
}
