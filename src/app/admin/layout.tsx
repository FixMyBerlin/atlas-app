import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ADMIN Radverkehrsatlas',
  robots: 'noindex',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // await useAuthenticatedBlitzContext({
  //   redirectTo: '/auth/login',
  //   role: ['admin'],
  //   redirectAuthenticatedTo: '/admin',
  // })

  return <div className="bg-pink-300">{children}</div>
}
