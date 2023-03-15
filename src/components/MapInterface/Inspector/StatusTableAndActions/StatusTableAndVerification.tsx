import { VerificationStatus } from '@api/api'
import { getSourceData, SourcesIds } from '@components/MapInterface/mapData'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { useUserStore } from '@components/MapInterface/UserInfo'
import { hasPermission } from '@components/MapInterface/UserInfo/utils'
import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import clsx from 'clsx'
import React from 'react'
import { VerificationActions } from './VerificationAction/VerificationActions'
import { VerificationHistory } from './VerificationHistory/VerificationHistory'

type Props = {
  properties: { [key: string]: any }
  sourceId: SourcesIds
}

export const StatusTableAndVerification: React.FC<Props> = ({ properties, sourceId }) => {
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
    | VerificationStatus
    | undefined

  return (
    <div
      className={clsx({
        'border-t bg-gray-50 px-4 py-2.5':
          sourceData.presence.enabled ||
          sourceData.verification.enabled ||
          sourceData.freshness.enabled,
      })}
    >
      {/* <StatusTable
        presenceVisible={sourceData.presence.enabled}
        verificationVisible={sourceData.verification.enabled}
        freshnessVisible={sourceData.freshness.enabled}
        properties={properties}
        freshnessDateKey={sourceData.freshness.dateKey}
        allowVerify={allowVerify}
        verificationStatus={verificationStatus}
      /> */}
      {sourceData.verification.enabled && (
        <>
          <VerificationActions
            apiIdentifier={sourceData.verification.apiIdentifier}
            visible={allowVerify}
            disabled={!properties?.category}
            osmId={properties.osm_id}
            verificationStatus={verificationStatus}
          />
          <VerificationHistory
            apiIdentifier={sourceData.verification.apiIdentifier}
            visible={allowVerify && verificationStatus !== undefined}
            osmId={properties.osm_id}
          />
        </>
      )}
    </div>
  )
}
