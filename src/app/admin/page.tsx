import { Routes } from '@blitzjs/next'
import { Metadata } from 'next'
import { Link } from 'src/app/_components/links/Link'

export const metadata: Metadata = {
  title: 'ADMIN Dashboard',
}

export default function AdminDashboard() {
  return (
    <ul>
      <li>
        <Link href={Routes.AdminRegionsPage()}>Regionen</Link>
      </li>
      <li>
        <Link href={Routes.AdminBikelaneVerificationsPage()}>Verifications</Link>
      </li>
    </ul>
  )
}

AdminDashboard.authenticate = true
