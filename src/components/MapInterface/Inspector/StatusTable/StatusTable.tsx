import React from 'react'
import { StatusTableFreshness } from './StatusTableFreshness'
import { StatusTablePresence } from './StatusTablePresence'
import { StatusTableVerification } from './StatusTableVerification'

type Props = {
  properties: { [key: string]: any }
  freshnessDateKey: string | undefined
  allowVerify: boolean
  verificationStatus: string | undefined
}

export const StatusTable: React.FC<Props> = ({
  properties,
  freshnessDateKey,
  allowVerify,
  verificationStatus,
}) => {
  return (
    <div className="mb-4">
      <h4 className="mb-2 font-semibold text-gray-900">
        Bewertung der Datenqualität
      </h4>
      <div className="grid grid-cols-3 text-gray-500">
        <StatusTablePresence properties={properties} />
        <StatusTableVerification
          allowVerify={allowVerify}
          verificationStatus={verificationStatus}
          properties={properties}
        />
        <StatusTableFreshness
          properties={properties}
          freshnessDateKey={freshnessDateKey}
        />
      </div>
    </div>
  )
}
