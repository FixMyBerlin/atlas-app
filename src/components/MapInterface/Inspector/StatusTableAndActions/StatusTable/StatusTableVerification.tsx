import {
  BoltIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { GeoJSONFeature } from 'maplibre-gl'

type Props = {
  visible: boolean
  allowVerify: boolean
  verificationStatus: string | undefined
  properties: GeoJSONFeature['properties']
}

export const StatusTableVerification: React.FC<Props> = ({
  visible,
  allowVerify,
  verificationStatus,
  properties,
}) => {
  if (!visible) return null
  if (!allowVerify) return null
  const { is_present } = properties

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
          {is_present ? (
            <>
              <QuestionMarkCircleIcon
                className="h-5 w-5 flex-none text-gray-600"
                aria-hidden="true"
              />
              <span>Überprüfung steht aus</span>
            </>
          ) : (
            <span className="text-gray-400">(Primärdaten fehlen)</span>
          )}
        </div>
      )}
    </section>
  )
}
