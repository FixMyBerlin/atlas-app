'use client'

import { useRouter } from 'next/navigation'
import { SignupForm } from 'src/auth/components/SignupForm'

export default function SignupPage() {
  const router = useRouter()

  return (
    <>
      <SignupForm onSuccess={() => router.push('/')} />
    </>
  )
}

SignupPage.authenticate = false
