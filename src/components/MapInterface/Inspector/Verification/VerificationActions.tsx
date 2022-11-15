import { buttonStyles } from '@components/Link'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { getApiUrl } from '@components/utils'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import React from 'react'

type Props = {
  apiIdentifier: string
  objectId: number
}

export const VerificationActions: React.FC<Props> = ({
  apiIdentifier,
  objectId,
}) => {
  const verificationData = new URLSearchParams()
  verificationData.append('osm_type', 'W')
  verificationData.append('verified_at', new Date().toISOString())

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(
        `${getApiUrl()}/verify/${apiIdentifier}/${objectId}?` +
          verificationData,
        {
          method: 'POST',
        }
      )
    },
  })

  return (
    <div className="border-t border-dotted px-4 py-3">
      <h4 className="mb-2 font-semibold text-gray-800">Daten bestätigen:</h4>
      <div className="space-x-2">
        <button
          onClick={() => {
            verificationData.append('verified_status', 'approved')
            mutation.mutate()
          }}
          disabled={mutation.isLoading}
          className={classNames(buttonStyles, 'bg-white hover:bg-green-200/80')}
        >
          Richtig
        </button>
        <button
          onClick={() => {
            verificationData.append('verified_status', 'rejected')
            mutation.mutate()
          }}
          disabled={mutation.isLoading}
          className={classNames(buttonStyles, 'hover:bg-orange-200/ bg-white')}
        >
          Überarbeitung nötig
        </button>
        {mutation.isLoading && <SmallSpinner />}
      </div>
    </div>
  )
}
