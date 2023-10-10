'use client'

import { useRouter } from 'next/router'
import { LoginForm } from 'src/auth/components/LoginForm'

export default function LoginPage() {
  const router = useRouter()

  return (
    <>
      <LoginForm
        onSuccess={(_user) => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : '/'
          return router.push(next)
        }}
      />
    </>
  )
}
