'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from 'src/app/(auth)/_components/LoginForm'

// TODO: Hooks in client component verschieben und page zu server component machen
// export const metadata: Metadata = { title: 'Anmelden' }

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  let next = searchParams?.get('next') || '/'

  return (
    <>
      <LoginForm
        onSuccess={(_user) => {
          // @ts-expect-error the search param is unkown from the router point of view. We would need some kind of zod-like validation if `next` is a valid router URL. Which would also be good from a security point of view.
          return router.push(next)
        }}
      />
    </>
  )
}

LoginPage.authenticate = false
