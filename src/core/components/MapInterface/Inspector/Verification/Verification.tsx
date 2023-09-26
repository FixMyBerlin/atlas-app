import { type TVerificationStatus } from '@api/api'
import { getSourceData, SourcesIds } from 'src/core/components/MapInterface/mapData'
import { useMapStateInteraction } from 'src/core/components/MapInterface/mapStateInteraction'
import { useUserStore } from 'src/core/components/MapInterface/UserInfo'
import { hasPermission } from 'src/core/components/MapInterface/UserInfo/utils'
import { LocationGenerics } from 'src/TODO-MIRGRATE-REMOVE/routes'
import { useMatch } from '@tanstack/react-location'
import React from 'react'
import { VerificationActions } from './VerificationAction/VerificationActions'
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
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  const sourceData = getSourceData(sourceId)

  const allowVerify =
    (sourceData.verification.enabled || false) && hasPermission(currentUser, region)

  const localVerificationStatus = [...localUpdates]
    .reverse()
    .find((update) => update.osm_id === properties.osm_id)?.verified

  const verificationStatus = (localVerificationStatus || properties.verified) as
    | TVerificationStatus
    | undefined

  if (!sourceData.verification.enabled) return null

  return (
    <section
      className="border-t bg-gray-200 p-4"
      style={{
        backgroundColor:
          verificationStatus === undefined ? verifiedBackgroundColor['undefined'] : '',
      }}
    >
      {verificationStatus === undefined && (
        <VerificationActions
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
              <VerificationActions
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
