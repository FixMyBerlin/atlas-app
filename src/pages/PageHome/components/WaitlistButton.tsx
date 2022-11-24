import { EnvelopeIcon } from '@heroicons/react/20/solid'
import { Button } from './Button'

export const WaitlistButton: React.FC = () => {
  return (
    <Button
      href="mailto:radverkehrsatlas@fixmycity.de&subject=radverkehrsatlas-Warteliste&body=Bitte nehmt mich mit dieser E-Mail-Adresse in die Warteliste auf und informiert mich über Neuigkeiten zum Radverkehrsatlas. — Danke"
      color="white"
      className="mt-10 flex items-center no-underline"
    >
      <EnvelopeIcon className="mr-2 h-6 w-6" /> radverkehrsatlas@fixmycity.de
    </Button>
  )
}
