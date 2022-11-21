import { getApiUrl } from '@components/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { VerificationHistoryWidget } from './VerificationHistoryWidget'

type Props = {
  visible: boolean
  osmId: number
}

export const VerificationHistory: React.FC<Props> = ({ osmId, visible }) => {
  if (!visible) return null

  const query = useQuery({
    queryKey: ['verificationHistory', osmId],
    queryFn: () => axios.get(`${getApiUrl()}/verify/lit/${osmId}/history`),
  })

  if (query.status !== 'success') return null

  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-600">
        Historie des Prüf-Status’
      </h3>
      <VerificationHistoryWidget history={query.data.data} />
    </div>
  )
}
