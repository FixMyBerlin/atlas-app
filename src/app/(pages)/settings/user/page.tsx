import { Metadata } from 'next'
import { UserForm } from './_components/UserForm'

export const metadata: Metadata = {
  robots: 'noindex',
  title: 'Account bearbeiten',
}

export default function SettingsUser() {
  return (
    <>
      <h1>Account bearbeiten</h1>
      <UserForm />
    </>
  )
}
