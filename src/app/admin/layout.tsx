import { Metadata } from 'next'
import { useAuthenticatedBlitzContext } from 'src/blitz-server'

export const metadata: Metadata = {
  robots: 'noindex',
  title: {
    default: 'ADMIN Radverkehrsatlas',
    template: 'ADMIN: %s – radverkehrsatlas.de',
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: '/api/auth/osm/login',
    // TODO MIGRATION AUTH: See https://github.com/blitz-js/blitz/issues/4246
    // redirectAuthenticatedTo: '/admin',
    role: ['ADMIN'],
  })

  return (
    <div className="min-h-full bg-pink-300">
      <div className="prose mx-auto w-full max-w-4xl py-10">
        <h1>Trassenscout ADMIN</h1>
        {children}
      </div>
    </div>
  )
}
