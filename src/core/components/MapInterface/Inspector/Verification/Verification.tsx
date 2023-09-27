import { getSourceData, SourcesIds } from 'src/core/components/MapInterface/mapData'
import { useMapStateInteraction } from 'src/core/components/MapInterface/mapStateInteraction'
import { useUserStore } from 'src/core/components/MapInterface/UserInfo'
import { hasPermission } from 'src/core/components/MapInterface/UserInfo/utils'
import { VerificationAction } from './VerificationAction/VerificationAction'
import { VerificationHistory } from './VerificationHistory/VerificationHistory'
import { VerificationStatus } from './VerificationStatus/VerificationStatus'
import { verifiedBackgroundColor } from './verifiedColor.const'
import { useRegion } from 'src/core/components/regionUtils/useRegion'
import { TVerificationStatus } from 'src/bikelane-verifications/schemas'

type Props = {
  properties: { [key: string]: any }
  sourceId: SourcesIds
}

export const Verification: React.FC<Props> = ({ properties, sourceId }) => {
  const { localUpdates } = useMapStateInteraction()
  const { currentUser } = useUserStore()
  const region = useRegion()
  const sourceData = getSourceData(sourceId)

  const allowVerify =
    (sourceData.verification.enabled || false) && hasPermission(currentUser, region)

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
