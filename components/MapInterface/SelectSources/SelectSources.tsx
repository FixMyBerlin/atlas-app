import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { sourcesList, SourcesListKeys } from '../Map'
import { cleanupTargetId } from '../Map/utils'
import { GeschichteStore, useQuery } from '../store/geschichte'
import { addSource, removeSource } from '../store/handleAddRemove'

export const SelectSources: React.FC = () => {
  const {
    values: { selectedSources },
    pushState,
  } = useQuery()
  const radioButtonScope = 'source'

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const sourceId = cleanupTargetId(event, radioButtonScope) as SourcesListKeys
    if (selectedSources?.includes(sourceId)) {
      pushState(
        (state: GeschichteStore) =>
          (state.selectedSources = removeSource(
            state.selectedSources,
            sourceId
          ))
      )
    } else {
      pushState(
        (state: GeschichteStore) =>
          (state.selectedSources = addSource(state.selectedSources, sourceId))
      )
    }
  }

  const sourceIds = Object.keys(sourcesList) as SourcesListKeys[]

  return (
    <form onChange={onChange}>
      <h2 className="text-base font-medium text-gray-900">Datensätze</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Datensätze</legend>
        <div className="space-y-2.5">
          {sourceIds.map((key) => {
            const { displayName } = sourcesList[key]

            // TODO – This feels hacky. Research solution.
            const keyThatRerendersOnceGeschichteIsReady = `${selectedSources?.join(
              '-'
            )}-${key}`
            return (
              <SelectEntryCheckbox
                scope={radioButtonScope}
                key={keyThatRerendersOnceGeschichteIsReady}
                id={key}
                label={displayName}
                active={!!selectedSources?.includes(key)}
              />
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
