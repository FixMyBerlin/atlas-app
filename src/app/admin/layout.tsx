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
      <div className="bg-pink-300">{children}</div>
    </>
  )
}
