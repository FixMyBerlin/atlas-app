import { Link } from '@components/Link'
import { getSourceData } from '@components/MapInterface/mapData'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { getApiUrl } from '@components/utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { extractSourceIdIdFromSourceKey } from '../../Map/SourceAndLayers/utils/extractFromSourceKey'
import { Verification } from './Verification'

type Props = {
  visible: boolean
  sourceKey: string
  objectId: number
}

export const VerificationStatus: React.FC<Props> = ({
  visible,
  sourceKey,
  objectId,
}) => {
  if (!visible) return null

  const sourceData = getSourceData(
    extractSourceIdIdFromSourceKey(sourceKey.toString())
  )
  const status = useQuery({
    queryKey: ['verificationStatus' + objectId],
    queryFn: async () => {
      const response = await fetch(
        `${getApiUrl()}/verify/lit/${objectId}`
      ).then()
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  return (
    <>
      <div className="space-x-3 border-t bg-gray-50 px-4 py-3">
        {(status.isLoading || status.error) && (
          <span className="mb-2 font-semibold text-gray-800">
            Daten Verifizierung
          </span>
        )}
        {!status.isLoading &&
          !status.error &&
          status.data?.verified != 'none' && (
            <span className="mb-2 font-semibold text-gray-800">
              Daten verifiziert als:
            </span>
          )}
        {!status.isLoading && status.data?.verified == 'none' && (
          <span className="mb-2 font-semibold text-gray-800">
            Daten noch nicht verifizert
          </span>
        )}
        {status.isLoading && (
          <span className="inline-flex items-center">
            <SmallSpinner />
            <span>Lädt</span>
          </span>
        )}
        {status.error && <span>Fehler beim Laden</span>}
        {status.data?.verified == 'approved' && (
          <span className="text-green-600"> Richtig</span>
        )}
        {status.data?.verified == 'rejected' && (
          <span className="text-orange-600"> Überarbeitung notwendig</span>
        )}
      </div>
      <div>
        {status.data && (
          <Verification
            visible={visible}
            sourceKey={sourceKey}
            objectId={objectId}
          />
        )}
      </div>
    </>
  )
}
