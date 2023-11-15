import { Metadata } from 'next'
import Image from 'next/image'
import imageBmdv from 'src/app/(pages)/kontakt/assets/logo-bmdv-foerderung.svg'
import imageMfund from 'src/app/(pages)/kontakt/assets/logo-mfund.png'
import { Link } from 'src/app/_components/links/Link'
import { LinkMail } from 'src/app/_components/links/LinkMail'
import { LinkTel } from 'src/app/_components/links/LinkTel'

export const metadata: Metadata = {
  robots: 'noindex',
  title: 'Fehler bei der Nutzung der OpenStreetMap Anmeldung',
}

export default function Kontakt({ params }) {
  return (
    <>
      <h1>Fehler bei der Nutzung der OpenStreetMap Anmeldung</h1>
      <pre className="mt-4">{JSON.stringify(params, undefined, 2)}</pre>
    </>
  )
}
