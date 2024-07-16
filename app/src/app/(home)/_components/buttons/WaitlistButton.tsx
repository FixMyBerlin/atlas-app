import { Link } from 'src/app/_components/links/Link'
import { EnvelopeIcon } from '@heroicons/react/20/solid'
import { LinkMail } from 'src/app/_components/links/LinkMail'

export const WaitlistButton: React.FC = () => {
  return (
    <LinkMail
      mailto="radverkehrsatlas@fixmycity.de"
      body="Bitte nehmt mich mit dieser E-Mail-Adresse in die Warteliste auf und informiert mich über Neuigkeiten zum Radverkehrsatlas. — Danke"
      subject="Radverkehrsatlas Anmeldung Warteliste"
      className="flex items-center bg-yellow-400 no-underline hover:bg-yellow-500"
      button
    >
      <EnvelopeIcon className="mr-2 h-6 w-6" /> radverkehrsatlas@fixmycity.de
    </LinkMail>
  )
}
