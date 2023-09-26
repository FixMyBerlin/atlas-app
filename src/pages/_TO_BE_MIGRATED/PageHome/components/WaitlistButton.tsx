import { Link } from 'src/core/components--TODO-MIGRATE/Link'
import { EnvelopeIcon } from '@heroicons/react/20/solid'

export const WaitlistButton: React.FC = () => {
  return (
    <Link
      to="radverkehrsatlas@fixmycity.de"
      mailBody="Bitte nehmt mich mit dieser E-Mail-Adresse in die Warteliste auf und informiert mich über Neuigkeiten zum Radverkehrsatlas. — Danke"
      mailSubject="Radverkehrsatlas Anmeldung Warteliste"
      className="flex items-center bg-yellow-400 no-underline hover:bg-yellow-500"
      button
    >
      <EnvelopeIcon className="mr-2 h-6 w-6" /> radverkehrsatlas@fixmycity.de
    </Link>
  )
}
