import { Metadata } from 'next'
import { useRouter } from 'next/navigation'
import { SignupForm } from 'src/app/(auth)/_components/SignupForm'

export const metadata: Metadata = { title: 'Anmelden' }

export default function SignupPage() {
  const router = useRouter()

  return (
    <>
      <SignupForm onSuccess={() => router.push('/')} />
    </>
  )
}

SignupPage.authenticate = false
