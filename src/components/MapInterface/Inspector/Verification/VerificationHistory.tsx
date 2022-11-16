import React from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { getApiUrl } from '@components/utils'
import VerificationHistoryWidget from './VerificationHistoryWidget'

interface Props {
  osmId: number
}

export const VerificationHistory: React.FC<Props> = ({ osmId }) => {
  const query = useQuery({
    queryKey: ['verificationHistory', osmId],
    queryFn: () => axios.get(`${getApiUrl()}/verify/lit/${osmId}/history`),
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
