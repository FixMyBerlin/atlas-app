import { useQuery } from '@blitzjs/rpc'
import { Suspense } from 'react'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import getBikelaneVerificationsByOsmId from 'src/bikelane-verifications/queries/getBikelaneVerificationsByOsmId'
import { SourceVerificationApiIdentifier } from '../../../mapData/sourcesMapData/sources.const'
import { VerificationHistoryEntries } from './VerificationHistoryEntries'

type Props = {
  apiIdentifier: SourceVerificationApiIdentifier
  visible: boolean
  osmId: number
}

const VerificationHistoryWithQuery = ({ osmId }: Pick<Props, 'osmId'>) => {
  const regionSlug = useRegionSlug()
  const [{ verifications }] = useQuery(getBikelaneVerificationsByOsmId, { osmId, regionSlug })

  // The first Item is shown by <VerificationStatus>
  const historyExceptFirst = verifications.slice(1)

  if (historyExceptFirst.length === 0) return null

  return (
    <details className="mb-0.5 mt-3">
      <summary className="cursor-pointer font-semibold text-gray-600">
        Prüfhistorie ({historyExceptFirst.length})
      </summary>
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
