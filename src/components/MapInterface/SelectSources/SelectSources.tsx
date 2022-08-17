import React from 'react'
import { useStore } from 'zustand'
import { SelectEntryCheckbox } from '../components'
import { sourcesList } from '../Map'
import { cleanupTargetId } from '../Map/utils'
import { StoreSelectedSources, useStoreMap } from '../store'

export const SelectSources: React.FC = () => {
  const { selectedSources, addSource, removeSource } = useStore(useStoreMap)
  const radioButtonScope = 'source'

  const onChange = (event) => {
    const sourceId = cleanupTargetId(event, radioButtonScope)
    if (selectedSources.includes(sourceId)) {
      removeSource(sourceId)
    } else {
      addSource(sourceId)
    }
  }

  const sourceIds = Object.keys(
    sourcesList
  ) as StoreSelectedSources['selectedSources']

  return (
    <form onChange={onChange}>
      <h2 className="text-base font-medium text-gray-900">Datensätze</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Datensätze</legend>
        <div className="space-y-2.5">
          {sourceIds.map((key) => {
            const { displayName } = sourcesList[key]
            return (
              <SelectEntryCheckbox
                scope={radioButtonScope}
                key={key}
                id={key}
                label={displayName}
                active={selectedSources.includes(key)}
              />
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
