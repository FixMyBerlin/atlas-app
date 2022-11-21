import { buttonStyles } from '@components/Link'
import { extractSourceIdIdFromSourceKey } from '@components/MapInterface/Map/SourceAndLayers/utils/extractFromSourceKey'
import { getSourceData } from '@components/MapInterface/mapData'
import { useUserStore } from '@components/MapInterface/UserInfo'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { getApiUrl } from '@components/utils'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import React from 'react'

type Props = {
  sourceKey: string
  visible: boolean
  osmId: number
  verificationStatus: string | undefined
}

export const VerificationActions: React.FC<Props> = ({
  sourceKey,
  visible,
  osmId,
  verificationStatus,
}) => {
  const { currentUser } = useUserStore()

  const sourceData = getSourceData(
    extractSourceIdIdFromSourceKey(sourceKey.toString())
  )
  const apiIdentifier = sourceData?.apiVerificationIdentifier

  const verificationParams = new URLSearchParams()
  verificationParams.append('osm_type', 'W')
  verificationParams.append('verified_by', currentUser?.id?.toString() || '')
  verificationParams.append('verified_at', new Date().toISOString())

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(
        `${getApiUrl()}/verify/${apiIdentifier}/${osmId}?` + verificationParams,
        {
          method: 'POST',
        }
      )
    },
  })

  const firstVerification = verificationStatus === undefined

  const ApproveButton = ({ children }: { children: React.ReactNode }) => {
    if (firstVerification || verificationStatus === 'approved') return null
    return (
      <button
        onClick={() => {
          verificationParams.append('verified_status', 'approved')
          mutation.mutate()
        }}
        disabled={mutation.isLoading}
        className={classNames(
          buttonStyles,
          'border-gray-400 bg-white py-1 px-3 shadow-md'
        )}
      >
        {children}
      </button>
    )
  }

  const RejectButton = ({ children }: { children: React.ReactNode }) => {
    if (firstVerification || verificationStatus === 'rejected') return null
    return (
      <button
        onClick={() => {
          verificationParams.append('verified_status', 'rejected')
          mutation.mutate()
        }}
        disabled={mutation.isLoading}
        className={classNames(
          buttonStyles,
          'border-gray-400 bg-white py-1 px-3 shadow-md'
        )}
      >
        {children}
      </button>
    )
  }

  if (!visible) return null
  if (!currentUser?.id) return null

  return (
    <div
      className={classNames('mb-4', {
        'flex items-center justify-between': !firstVerification,
      })}
    >
      <h4 className="mb-2 font-semibold text-gray-600">
        Prüf-Status {firstVerification ? 'eintragen' : 'ändern'}
      </h4>
      <div className="space-x-2">
        {mutation.isLoading && <SmallSpinner />}
        <ApproveButton>
          {firstVerification ? 'Richtig' : 'Daten richtig'}
        </ApproveButton>
        <RejectButton>Überarbeitung nötig</RejectButton>
      </div>
    </div>
  )
}
