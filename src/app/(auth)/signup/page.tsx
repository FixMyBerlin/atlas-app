'use client'

import { useRouter } from 'next/navigation'
import { MetaTags } from 'src/app/_components/layouts/MetaTags/MetaTags'
import { SignupForm } from 'src/auth/components/SignupForm'

export default function SignupPage() {
  const router = useRouter()

  return (
    <>
      <MetaTags noindex title="Anmelden" />
      <SignupForm onSuccess={() => router.push('/')} />
    </>
  )
}

SignupPage.authenticate = false
