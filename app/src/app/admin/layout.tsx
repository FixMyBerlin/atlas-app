import { useAuthenticatedBlitzContext } from '@/src/blitz-server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex',
  title: {
    default: 'ADMIN TILDA',
    template: 'ADMIN: %s – tilda-geo.de/admin',
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/rules-of-hooks
  await useAuthenticatedBlitzContext({
    // TODO MIGRATION AUTH: next param does not work; is not supported by src/pages/api/auth/[...nextauth].ts
    redirectTo: '/api/auth/osm/login?next=/admin',
    // The next part is broken, see https://github.com/blitz-js/blitz/issues/4246
    // But I don't think we really need it.
    // redirectAuthenticatedTo: '/admin',
    role: ['ADMIN'],
  })

  return (
    <div className="min-h-full bg-pink-300">
      <main className="prose mx-auto w-full max-w-4xl py-10">
        <h1>TILDA ADMIN</h1>
        {children}
      </main>
    </div>
  )
}
