import { MetaTags } from '../_components/layouts/MetaTags/MetaTags'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // await useAuthenticatedBlitzContext({
  //   redirectTo: '/auth/login',
  //   role: ['admin'],
  //   redirectAuthenticatedTo: '/admin',
  // })

  return (
    <>
      <MetaTags noindex title="ADMIN Radverkehrsatlas" />
      <div className="bg-pink-300">{children}</div>
    </>
  )
}
