import React from 'react'
import { StatusTableFreshness } from './StatusTableFreshness'
import { StatusTablePresence } from './StatusTablePresence'
import { StatusTableVerification } from './StatusTableVerification'

type Props = {
  presenceVisible: boolean
  verificationVisible: boolean
  freshnessVisible: boolean
  properties: { [key: string]: any }
  freshnessDateKey: string | undefined
  allowVerify: boolean
  verificationStatus: string | undefined
}

export const StatusTable: React.FC<Props> = ({
  presenceVisible,
  verificationVisible,
  freshnessVisible,
  properties,
  freshnessDateKey,
  allowVerify,
  verificationStatus,
}) => {
  if (!presenceVisible || !verificationVisible || !freshnessVisible) return null

  return (
    <div className="mb-4">
      <h4 className="mb-2 font-semibold text-gray-900">
        Bewertung der Datenqualität
      </h4>
      <div className="grid grid-cols-3 text-gray-500">
        <StatusTablePresence
          visible={presenceVisible}
          properties={properties}
        />
        <StatusTableVerification
          visible={verificationVisible}
          allowVerify={allowVerify}
          verificationStatus={verificationStatus}
          properties={properties}
        />
        <StatusTableFreshness
          visible={freshnessVisible}
          properties={properties}
          freshnessDateKey={freshnessDateKey}
        />
      </div>
    </div>
  )
}
