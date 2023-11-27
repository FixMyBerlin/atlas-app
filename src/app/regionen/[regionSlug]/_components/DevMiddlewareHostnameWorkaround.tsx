'use client'

import { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { isBrowser, isDev } from 'src/app/_components/utils/isEnv'

// NOTICE:
// This is a workaround for a bug in NextJS in dev mode in the middleware.
// In `/src/middleware.ts` we rewrite the URL so the region page always has a map and config param.
// However, in dev mode this also change the hostname from 127.0.0.1 to localhost.
// (It does not respect the `--hostname 127.0.0.1` flag that `npm run dev` uses.)
// It was not possible to rewrite this right in the middleware, so we have to do it in the client here.
// This is likely solved in a future NextJS version, but we are stuck with the 13.* tree for now, see https://github.com/blitz-js/blitz/issues/4253
// I was not able to find a ticket on this specific but in NextJS but but comments suggest that current NextJS versions will hot have the issue.
export const DevMiddlewareHostnameWorkaround = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (isDev && isBrowser && window.location.hostname === 'localhost' && pathname) {
    const url = new URL(pathname, process.env.NEXT_PUBLIC_APP_ORIGIN)
    router.push(`${url}?${searchParams?.toString()}` as Route)
    return null
  }

  return null
}
