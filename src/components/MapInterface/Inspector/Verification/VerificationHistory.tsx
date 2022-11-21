import React from 'react'
import { useQuery } from '@tanstack/react-query'

import VerificationHistoryWidget from './VerificationHistoryWidget'
import { getHistory } from '../../../../api'

interface Props {
  osmId: number
}

export const VerificationHistory: React.FC<Props> = ({ osmId }) => {
  const query = useQuery({
    queryKey: ['verificationHistory', osmId],
    queryFn: () => getHistory('lit', osmId),
  })

  if (query.status !== 'success') return null

  return (
    <div className="p-3">
      <div>
        <span className="mb-2 font-semibold text-gray-800">
          Verification History
        </span>
      </div>
      <VerificationHistoryWidget history={query.data.data} />
    </div>
  )
}
