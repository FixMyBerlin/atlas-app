'use client'

import { useRegion } from 'src/app/(pages)/_components/regionUtils/useRegion'
import { TVerificationStatus } from 'src/bikelane-verifications/schemas'
import { useUserStore } from '../../UserInfo/useUserStore'
import { hasPermission } from '../../UserInfo/utils/hasPermission'
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
