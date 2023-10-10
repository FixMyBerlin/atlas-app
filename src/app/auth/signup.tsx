'use client'

import { Routes } from '@blitzjs/next'
import { useRouter } from 'next/router'
import { SignupForm } from 'src/auth/components/SignupForm'

export default function SignupPage() {
  const router = useRouter()

  return (
    <>
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </>
  )
}
