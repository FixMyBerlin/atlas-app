import { getHistory } from '@api/index'
import { useQuery } from '@tanstack/react-query'
import { VerificationHistoryWidget } from './VerificationHistoryWidget'

type Props = {
  visible: boolean
  osmId: number
}

export const VerificationHistory: React.FC<Props> = ({ osmId, visible }) => {
  if (!visible) return null

  const query = useQuery({
    queryKey: ['verificationHistory', osmId],
    queryFn: () => getHistory('lit', osmId),
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
