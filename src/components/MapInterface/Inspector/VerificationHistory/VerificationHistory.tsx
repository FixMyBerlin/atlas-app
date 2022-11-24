import { getHistory } from '@api/index'
import { SourceVerificationApiIdentifier } from '@components/MapInterface/mapData'
import { useQuery } from '@tanstack/react-query'
import { VerificationHistoryWidget } from './VerificationHistoryWidget'

type Props = {
  apiIdentifier: SourceVerificationApiIdentifier
  visible: boolean
  osmId: number
}

export const VerificationHistory: React.FC<Props> = ({
  apiIdentifier,
  visible,
  osmId,
}) => {
  if (!visible || !apiIdentifier) return null

  const query = useQuery({
    queryKey: ['verificationHistory', apiIdentifier, osmId],
    queryFn: () => getHistory(apiIdentifier, osmId),
  })

  if (query?.status !== 'success' || !apiIdentifier) return null

  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-600">
        Historie des Prüf-Status’
      </h3>
      <VerificationHistoryWidget history={query.data.data} />
    </div>
  )
}
