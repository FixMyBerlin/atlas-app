import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex',
  title: {
    default: 'ADMIN Radverkehrsatlas',
    template: 'ADMIN: %s – radverkehrsatlas.de',
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // await useAuthenticatedBlitzContext({
  //   redirectTo: '/auth/login',
  //   role: ['admin'],
  //   redirectAuthenticatedTo: '/admin',
  // })

  return (
    <>
      <div className="min-h-full bg-pink-300">
        <div className="prose mx-auto w-full max-w-4xl py-10">
          <h1>Trassenscout ADMIN</h1>
          {children}
        </div>
      </div>
    </>
  )
}
