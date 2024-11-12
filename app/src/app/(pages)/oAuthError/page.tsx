import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex',
  title: 'Fehler bei der Nutzung der OpenStreetMap Anmeldung',
}

export default function OAuthErrorPage({ searchParams }) {
  return (
    <>
      <h1>Fehler bei der Nutzung der OpenStreetMap Anmeldung</h1>
      <pre className="mt-4">{JSON.stringify(searchParams, undefined, 2)}</pre>
    </>
  )
}
