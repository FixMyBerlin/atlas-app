import { getSourceData } from '@components/MapInterface/mapData'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { getApiUrl } from '@components/utils'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { extractSourceIdIdFromSourceKey } from '../../Map/SourceAndLayers/utils/extractFromSourceKey'

type Props = {
  visible: boolean
  sourceKey: string
  objectId: number
}

export const Verification: React.FC<Props> = ({
  visible,
  sourceKey,
  objectId,
}) => {
  if (!visible) return null

  const sourceData = getSourceData(
    extractSourceIdIdFromSourceKey(sourceKey.toString())
  )
  console.log(
    'We might want to put the API routes on the source object and use this here?',
    sourceData
  )

  const verificationData = new URLSearchParams()
  verificationData.append('osm_type', 'W')
  verificationData.append('verified_at', new Date().toISOString())

  const mutation = useMutation({
    mutationFn: () => {
      // event.preventDefault()
      return fetch(
        `${getApiUrl()}/verify/lit/${objectId}?` + verificationData,
        {
          method: 'POST',
        }
      )
    },
  })

  return (
    <div className="border-t bg-gray-50 px-4 py-3">
      <h4 className="mb-2 font-semibold text-gray-800">Daten bestätigen:</h4>
      <div className="space-x-2">
        <button
          onClick={() => {
            verificationData.append('verified_status', 'approved')
            mutation.mutate()
          }}
          disabled={mutation.isLoading}
        >
          Richtig
        </button>
        <button
          onClick={() => {
            verificationData.append('verified_status', 'rejected')
            mutation.mutate()
          }}
          disabled={mutation.isLoading}
        >
          Überarbeitung nötig
        </button>
        {mutation.isLoading && <SmallSpinner />}
        {/* <Link to="#todo" button className="bg-white hover:bg-green-200/80">
          Daten richtig
        </Link>
        <Link to="#todo" button className="bg-white hover:bg-orange-200/80">
          Überarbeitung nötig
        </Link> */}
      </div>
    </div>
  )
}
