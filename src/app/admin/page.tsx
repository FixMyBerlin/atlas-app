import { Metadata } from 'next'
import { Link } from 'src/app/_components/links/Link'
import { Breadcrumb } from './_components/Breadcrumb'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  return (
    <>
      <Breadcrumb pages={[{ href: '/admin', name: 'Dashboard' }]} />
      <ul>
        <li>
          <Link href="/admin/regions">Regionen</Link>
        </li>
        <li>
          <Link href="/admin/verifications">Verifications</Link>
        </li>
        <li>
          <Link href="/admin/memberships">Memberships</Link>
        </li>
      </ul>
    </>
  )
}
