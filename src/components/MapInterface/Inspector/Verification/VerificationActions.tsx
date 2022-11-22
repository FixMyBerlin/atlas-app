import React from 'react'
import classNames from 'classnames'

import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { buttonStyles } from '@components/Link'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateVerificationStatus } from '../../../../api'

type Props = {
  apiIdentifier: string
  objectId: number
}

export const VerificationActions: React.FC<Props> = ({
  apiIdentifier,
  objectId,
}) => {
  const queryClient = useQueryClient()
  const { addLocalUpdate, removeLocalUpdate } = useMapStateInteraction()

  const apiData = {
    type_name: apiIdentifier,
    osm_id: objectId,
    osm_type: 'W',
    verified_at: new Date().toISOString(),
    verified_status: '*** needs to be set ***',
  }

  const queryKey = ['verificationHistory', apiData.osm_id]

  const mutation = useMutation({
    mutationFn: updateVerificationStatus,
    // When mutate is called:
    onMutate: async (queryParams) => {
      const { osm_id, osm_type, verified_at, verified_status } = queryParams
      const newHistoryItem = {
        osm_id,
        osm_type,
        verified_at,
        verified_by: 'You!',
        verified: verified_status,
      }

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousHistory = queryClient.getQueryData(queryKey)

      // Optimistically update to the new value
      queryClient.setQueryData(
        queryKey,
        (data: undefined | { data: object }) => {
          const history = data?.data ? data.data : []
          return {
            // @ts-ignore will work
            data: [newHistoryItem, ...history],
          }
        }
      )

      // @ts-ignore TODO: make this work
      addLocalUpdate(newHistoryItem)

      // Return a context object with the snapshotted value
      return { previousHistory, newHistoryItem }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    // use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousHistory)
        // @ts-ignore TODO: make this work
        removeLocalUpdate(context.newHistoryItem)
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(queryKey)
    },
  })

  return (
    <div className="border-t border-dotted px-4 py-3">
      <h4 className="mb-2 font-semibold text-gray-800">Daten bestätigen:</h4>
      <div className="space-x-2">
        <button
          onClick={() => {
            mutation.mutate({ ...apiData, verified_status: 'approved' })
          }}
          disabled={mutation.isLoading}
          className={classNames(buttonStyles, 'bg-white hover:bg-green-200/80')}
        >
          Richtig
        </button>
        <button
          onClick={() => {
            mutation.mutate({ ...apiData, verified_status: 'rejected' })
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
