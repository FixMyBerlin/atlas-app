import { getHistory } from '@api/index'
import { SourceVerificationApiIdentifier } from '@components/MapInterface/mapData'
import { useQuery } from '@tanstack/react-query'
import { VerificationHistoryEntry } from './VerificationHistoryEntry'

type Props = {
  apiIdentifier: SourceVerificationApiIdentifier
  visible: boolean
  osmId: number
}

export const VerificationHistory: React.FC<Props> = ({ apiIdentifier, visible, osmId }) => {
  const query = useQuery({
    queryKey: ['verificationHistory', apiIdentifier, osmId],
    queryFn: () => getHistory(apiIdentifier, osmId),
  })

  if (!visible || query?.status !== 'success') return null

  // The first Item is shown by <VerificationStatus>
  const historyExceptFirst = query.data.data.slice(1)

  if (!historyExceptFirst.length) return null

  return (
    <details className="mt-3 mb-0.5">
      <summary className="cursor-pointer font-semibold text-gray-600">Prüfhistorie</summary>
      <VerificationHistoryEntry history={historyExceptFirst} />
    </details>
  )
}
