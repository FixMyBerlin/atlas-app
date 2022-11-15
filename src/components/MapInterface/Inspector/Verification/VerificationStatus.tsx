import { SmallSpinner } from '@components/Spinner/Spinner'
import { getApiUrl } from '@components/utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

type Props = {
  apiIdentifier: string
  objectId: number
}

export const VerificationStatus: React.FC<Props> = ({
  apiIdentifier,
  objectId,
}) => {
  const status = useQuery({
    queryKey: ['verificationStatus', objectId],
    queryFn: async () => {
      const response = await fetch(
        `${getApiUrl()}/verify/${apiIdentifier}/${objectId}`
      ).then()
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  return (
    <div className="space-x-3 px-4 py-3">
      <>
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
      </>
    </div>
  )
}
