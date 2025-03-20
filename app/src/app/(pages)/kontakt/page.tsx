import imageBmdv from '@/src/app/(pages)/kontakt/assets/logo-bmdv-foerderung.svg'
import imageMfund from '@/src/app/(pages)/kontakt/assets/logo-mfund.png'
import { Link } from '@/src/app/_components/links/Link'
import { LinkMail } from '@/src/app/_components/links/LinkMail'
import { LinkTel } from '@/src/app/_components/links/LinkTel'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  robots: 'noindex',
  title: 'Kontakt und Impressum',
}

export default function KontaktPage() {
  return (
    <>
      <h1>Kontakt und Impressum</h1>
      <p>
        <strong>FixMyCity GmbH</strong>
        <br />
        Oberlandstraße 26-35
        <br />
        12099 Berlin
        <br />
        <LinkMail subject="Feedback TILDA">feedback@fixmycity.de</LinkMail>
        <br />
        Telefon: <LinkTel>+49-30-54908665</LinkTel>
        <br />
      </p>
      <p>Gesellschafter: Boris Hekele und Heiko Rintelen</p>
      <p>
        Registergericht: Amtsgericht Berlin-Charlottenburg
        <br />
        Registernummer: HRB 205031 B
      </p>
      <p>Umsatzsteuer-Identifikationsnummer gem. § 27a UStG: DE323489466</p>
      <p>Verantwortlicher i.S.v. § 55 Rundfunkstaatsvertrag (RStV): Boris Hekele</p>
      <h2>Feedback &amp; Kontakt</h2>
      <p>
        Wir freuen uns über Kommentare Anregungen und Unterstützung an{' '}
        <LinkMail subject="Feedback TILDA">feedback@fixmycity.de</LinkMail>
      </p>
      <p>
        Sie finden uns auch auf{' '}
        <Link blank href="https://www.linkedin.com/company/fixmycity">
          LinkedIn
        </Link>
      </p>
      <p>
        Sofern Sie Bugs oder Verbesserungsvorschläge haben, geben Sie uns gerne{' '}
        <Link blank href="https://github.com/FixMyBerlin/atlas-app">
          auf GitHub Feedback
        </Link>
        . Sie können den Source Code auch weiterentwickeln. Lizenz:{' '}
        <Link href="https://github.com/FixMyBerlin/atlas-app/blob/develop/LICENSE.md" blank>
          AGPL v3
        </Link>
        .
      </p>
      <h2>Urheberrechte Fotos</h2>
      <p>
        Wenn nicht anders angegeben stehen die auf dieser Website verwendeten Fotos unter{' '}
        <Link blank href="https://creativecommons.org/licenses/by-nc/4.0/">
          Creative Commons-Lizenz BY-NC 4.0
        </Link>
        .
      </p>
      <h2>Förderung</h2>
      <p>
        Diese Website wird im Rahmen des mFund-Projektes “Kommunale Radverkehrsplanung und
        Instandhaltung aus OpenStreetMap-Daten ermöglichen – OSM-RVP” vom Bundesministerium für
        Digitales und Verkehr (BMDV) gefördert. <br />
        Förderkennzeichen 19F1096A,{' '}
        <Link
          blank
          href="https://www.bmdv.bund.de/SharedDocs/DE/Artikel/DG/mfund-projekte/osm-rvp.html"
        >
          <strong>Projektsteckbrief</strong>
        </Link>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Link blank href="https://bmdv.bund.de/">
          <Image src={imageBmdv} alt="Förderung durch BMDV" className="w-40" />
        </Link>
        <Link blank href="https://www.bmvi.de/DE/Themen/Digitales/mFund/Ueberblick/ueberblick.html">
          <Image src={imageMfund} alt="Förderung durch den mFund" className="w-40" />
        </Link>
      </div>
    </>
  )
}
