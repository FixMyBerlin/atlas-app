import React, { Suspense } from 'react'
import { VerificationSchema, TVerificationStatus } from 'src/bikelane-verifications/schemas'
import { SourceVerificationApiIdentifier } from 'src/core/components/MapInterface/mapData'
import { Spinner } from 'src/core/components/Spinner/Spinner'
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
