import React, { Suspense } from 'react'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { TVerificationStatus, VerificationSchema } from 'src/bikelane-verifications/schemas'
import { SourceVerificationApiIdentifier } from '../../../mapData/sourcesMapData/sources.const'
import { VerificationActionForm } from './VerificationActionForm'

type Props = {
  apiIdentifier: SourceVerificationApiIdentifier
  visible: boolean
  disabled: boolean
  osmId: number
  verificationStatus: TVerificationStatus | undefined
}

export const VerificationAction: React.FC<Props> = ({
  apiIdentifier,
  visible,
  disabled: outerDisabled,
  osmId,
  verificationStatus,
}) => {
  if (apiIdentifier !== 'bikelanes') {
    console.warn('Invalid apiIdentifier', apiIdentifier)
    return null
  }
  if (!visible) return null

  return (
    <Suspense fallback={<Spinner />}>
      <VerificationActionForm
        disabled={outerDisabled}
        schema={VerificationSchema}
        verificationStatus={verificationStatus}
        initialValues={{ osm_id: BigInt(osmId) }}
      />
    </Suspense>
  )
}
