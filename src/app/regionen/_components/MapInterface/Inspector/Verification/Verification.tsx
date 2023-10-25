import { TVerificationStatus } from 'src/bikelane-verifications/schemas'
import { useHasPermissions } from 'src/app/_hooks/useHasPermissions'
import { SourcesIds } from '../../mapData/sourcesMapData/sources.const'
import { getSourceData } from '../../mapData/utils/getMapDataUtils'
import { useMapStateInteraction } from '../../mapStateInteraction/useMapStateInteraction'
import { VerificationAction } from './VerificationAction/VerificationAction'
import { VerificationHistory } from './VerificationHistory/VerificationHistory'
import { VerificationStatus } from './VerificationStatus/VerificationStatus'
import { verifiedBackgroundColor } from './verifiedColor.const'

type Props = {
  properties: { [key: string]: any }
  sourceId: SourcesIds
}

export const Verification: React.FC<Props> = ({ properties, sourceId }) => {
  const { localUpdates } = useMapStateInteraction()
  const sourceData = getSourceData(sourceId)

  const hasPermissions = useHasPermissions()
  const allowVerify = (sourceData.verification.enabled || false) && hasPermissions

  const localVerificationStatus = [...localUpdates]
    .reverse()
    .find((update) => update.osm_id === properties.osm_id)?.verified

  const verificationStatus = (localVerificationStatus || properties.verified) as
    | TVerificationStatus
    | undefined

  if (!sourceData.verification.enabled || !allowVerify) return null

  return (
    <section
      className="border-t bg-gray-200 p-4"
      style={{
        backgroundColor:
          verificationStatus === undefined ? verifiedBackgroundColor['undefined'] : '',
      }}
    >
      {verificationStatus === undefined && (
        <VerificationAction
          apiIdentifier={sourceData.verification.apiIdentifier}
          visible={allowVerify}
          disabled={!properties?.category}
          osmId={properties.osm_id}
          verificationStatus={verificationStatus}
        />
      )}
      {verificationStatus !== undefined && (
        <>
          <VerificationStatus
            apiIdentifier={sourceData.verification.apiIdentifier}
            visible={allowVerify && verificationStatus !== undefined}
            osmId={properties.osm_id}
          />
          <details className="mt-3">
            <summary className="cursor-pointer font-semibold text-gray-600">Status ändern</summary>
            <div className="mt-2">
              <VerificationAction
                apiIdentifier={sourceData.verification.apiIdentifier}
                visible={allowVerify}
                disabled={!properties?.category}
                osmId={properties.osm_id}
                verificationStatus={verificationStatus}
              />
            </div>
          </details>
        </>
      )}
      <VerificationHistory
        apiIdentifier={sourceData.verification.apiIdentifier}
        visible={allowVerify && verificationStatus !== undefined}
        osmId={properties.osm_id}
      />
    </section>
  )
}
