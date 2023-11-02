'use client'

import { Metadata } from 'next'
import { SignupForm } from 'src/app/(auth)/_components/SignupForm'

export const metadata: Metadata = { title: 'Anmelden' }

export default function SignupPage() {
  return (
    <>
      <SignupForm />
    </>
  )
}
