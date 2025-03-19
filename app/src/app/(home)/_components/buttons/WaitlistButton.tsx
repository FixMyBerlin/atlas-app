import { LinkMail } from '@/src/app/_components/links/LinkMail'
import { EnvelopeIcon } from '@heroicons/react/20/solid'

export const WaitlistButton: React.FC = () => {
  return (
    <LinkMail
      mailto="radverkehrsatlas@fixmycity.de"
      body="Bitte informiert mich über Neuigkeiten TILDA. — Danke"
      subject="TILDA"
      className="flex items-center bg-yellow-400 no-underline hover:bg-yellow-500"
      button
    >
      <EnvelopeIcon className="mr-2 h-6 w-6" /> radverkehrsatlas@fixmycity.de
    </LinkMail>
  )
}
