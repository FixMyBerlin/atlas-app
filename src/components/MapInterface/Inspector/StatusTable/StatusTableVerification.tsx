import {
  BoltIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

type Props = {
  allowVerify: boolean
  verificationStatus: string | undefined
}

export const StatusTableVerification: React.FC<Props> = ({
  allowVerify,
  verificationStatus,
}) => {
  if (!allowVerify) return null

  return (
    <section>
      <h5 className="mb-2 font-semibold text-gray-600">Prüf-Status (intern)</h5>
      {verificationStatus === 'approved' && (
        <div className="flex gap-1" title="">
          <ShieldCheckIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span>Daten richtig</span>
        </div>
      )}
      {verificationStatus === 'rejected' && (
        <div className="flex gap-1" title="">
          <BoltIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span>Überarbeitung notwendig</span>
        </div>
      )}
      {verificationStatus === undefined && (
        <div className="flex gap-1" title="">
          <QuestionMarkCircleIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span>Überprüfung steht aus</span>
        </div>
      )}
    </section>
  )
}
