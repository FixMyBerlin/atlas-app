import { useHasPermissions } from '@/src/app/_hooks/useHasPermissions'
import { useRegionSlug } from '@/src/app/regionen/[regionSlug]/_components/regionUtils/useRegionSlug'
import getBikelaneVerificationsByOsmId from '@/src/server/bikelane-verifications/queries/getBikelaneVerificationsByOsmId'
import { TVerificationStatus } from '@/src/server/bikelane-verifications/schemas'
import { useQuery } from '@blitzjs/rpc'
import { useMapLocalUpdates } from '../../../_hooks/mapState/useMapState'
import { SourcesId } from '../../../_mapData/mapDataSources/sources.const'
import { getSourceData } from '../../../_mapData/utils/getMapDataUtils'
import { VerificationForm } from './VerificationForm/VerificationForm'
import { VerificationHistory } from './VerificationHistory/VerificationHistory'
import { VerificationStatus } from './VerificationStatus/VerificationStatus'
import { verifiedBackgroundColor } from './verifiedColor.const'

type Props = {
  properties: { [key: string]: any }
  sourceId: SourcesId
}

export const Verification: React.FC<Props> = ({ properties, sourceId }) => {
  const localUpdates = useMapLocalUpdates()
  const sourceData = getSourceData(sourceId)
  const hasPermissions = useHasPermissions()

  // We fetch the list of verifications here in the parent component so we can refetch it in one place after form sumbission.
  const regionSlug = useRegionSlug()
  const [paginatedVerifications, { refetch: refetchVerifications }] = useQuery(
    getBikelaneVerificationsByOsmId,
    { osmId: properties.osm_id, regionSlug },
    { enabled: hasPermissions }, // Guard against AuthorizationError
  )
  const verifications = paginatedVerifications?.verifications || []

  const localVerificationStatus = [...localUpdates]
    .reverse()
    .find((update) => update.osm_id === properties.osm_id)?.verified

  const verificationStatus = (localVerificationStatus || properties.verified) as
    | TVerificationStatus
    | undefined

  if (!sourceData.verification.enabled || !hasPermissions) return null

  // TODO: I don't quite get why this is here.
  // It looks like this will only work for bikelanes(?) and given that redundant to apiIdentifier !== 'bikelanes'.
  // We will have to revisit this once we add a second validation layer.
  const disabled = !properties?.category

  if (sourceData.verification.apiIdentifier !== 'bikelanes') {
    console.warn('Invalid apiIdentifier', sourceData)
    return null
  }

  return (
    <section
      className="border-t bg-gray-200 p-4"
      style={{
        backgroundColor:
          verificationStatus === undefined ? verifiedBackgroundColor['undefined'] : '',
      }}
    >
      {verificationStatus === undefined && (
        <VerificationForm
          disabled={disabled}
          osmId={properties.osm_id}
          verificationStatus={verificationStatus}
          refetchVerifications={refetchVerifications}
        />
      )}
      {verificationStatus !== undefined && (
        <>
          <VerificationStatus
            verifications={verifications}
            visible={verificationStatus !== undefined}
          />
          <details className="mt-3">
            <summary className="cursor-pointer font-semibold text-gray-600">Status ändern</summary>
            <div className="mt-2">
              <VerificationForm
                disabled={disabled}
                osmId={properties.osm_id}
                verificationStatus={verificationStatus}
                refetchVerifications={refetchVerifications}
              />
            </div>
          </details>
        </>
      )}
      <VerificationHistory
        verifications={verifications}
        visible={verificationStatus !== undefined}
        count={paginatedVerifications?.count}
      />
    </section>
  )
}
