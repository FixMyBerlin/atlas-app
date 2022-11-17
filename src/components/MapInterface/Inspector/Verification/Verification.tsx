import { extractSourceIdIdFromSourceKey } from '@components/MapInterface/Map/SourceAndLayers/utils/extractFromSourceKey'
import { getSourceData } from '@components/MapInterface/mapData'
import React from 'react'
import { VerificationStatus } from './VerificationStatus'
import { VerificationActions } from './VerificationActions'

export type VerificationProps = {
  sourceKey: string
  objectId: number
  verificationStatus: string
}

type Props = VerificationProps & { visible: boolean }

export const Verification: React.FC<Props> = ({
  visible,
  sourceKey,
  objectId,
  verificationStatus,
}) => {
  const sourceData = getSourceData(
    extractSourceIdIdFromSourceKey(sourceKey.toString())
  )
  const apiIdentifier = sourceData?.apiVerificationIdentifier

  if (!visible || !apiIdentifier) return null

  return (
    <div className="border-t bg-gray-50">
      <VerificationStatus verificationStatus={verificationStatus} />
      <VerificationActions apiIdentifier={apiIdentifier} objectId={objectId} />
    </div>
  )
}
