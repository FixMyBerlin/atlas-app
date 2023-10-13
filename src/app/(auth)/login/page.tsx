'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from 'src/auth/components/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams?.get('search')

  return (
    <>
      <LoginForm
        onSuccess={(_user) => {
          const next = search ? decodeURIComponent(search) : '/'
          // @ts-expect-error the search param is unkown from the router point of view. We would need some kind of zod-like validation if `next` is a valid router URL. Which would also be good from a security point of view.
          return router.push(next)
        }}
      />
    </>
  )
}

LoginPage.authenticate = false
