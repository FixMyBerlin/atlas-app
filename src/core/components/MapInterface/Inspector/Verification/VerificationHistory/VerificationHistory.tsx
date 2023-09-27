import { useQuery } from '@blitzjs/rpc'
import { Spinner } from '@components/Spinner/Spinner'
import { Suspense } from 'react'
import getBikelaneVerificationsByOsmId from 'src/bikelane-verifications/queries/getBikelaneVerificationsByOsmId'
import { SourceVerificationApiIdentifier } from 'src/core/components/MapInterface/mapData'
import { VerificationHistoryEntries } from './VerificationHistoryEntries'

type Props = {
  apiIdentifier: SourceVerificationApiIdentifier
  visible: boolean
  osmId: number
}

const VerificationHistoryWithQuery = ({ osmId }: Pick<Props, 'osmId'>) => {
  const [{ verifications }] = useQuery(getBikelaneVerificationsByOsmId, { osmId })

  // The first Item is shown by <VerificationStatus>
  const historyExceptFirst = verifications.slice(1)

  return (
    <details className="mt-3 mb-0.5">
      <summary className="cursor-pointer font-semibold text-gray-600">Prüfhistorie</summary>
      <VerificationHistoryEntries history={historyExceptFirst} />
    </details>
  )
}

export const VerificationHistory = ({ apiIdentifier, visible, osmId }: Props) => {
  if (apiIdentifier !== 'bikelanes') {
    console.warn('Invalid apiIdentifier', apiIdentifier)
    return null
  }
  if (!visible) return null

  return (
    <Suspense fallback={<Spinner />}>
      <VerificationHistoryWithQuery osmId={osmId} />
    </Suspense>
  )
}
