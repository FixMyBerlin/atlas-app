import { Metadata } from 'next'
import { Link } from 'src/app/_components/links/Link'

export const metadata: Metadata = {
  title: 'ADMIN Dashboard',
}

export default function AdminDashboard() {
  return (
    <ul>
      <li>
        <Link href="/admin/regions">Regionen</Link>
      </li>
      <li>
        <Link href="/admin/verifications">Verifications</Link>
      </li>
    </ul>
  )
}

AdminDashboard.authenticate = true
