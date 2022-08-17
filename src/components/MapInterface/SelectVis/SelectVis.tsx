import React from 'react'
import { useStore } from 'zustand'
import { SelectEntryRadibutton } from '../components'
import { visualisationsList } from '../Map/parkingLanes'
import { cleanupTargetId } from '../Map/utils'
import { useStoreMap } from '../store'

export const SelectVis: React.FC = () => {
  const { selectedSources, selectedVis, selectVis } = useStore(useStoreMap)
  const radioButtonScope = 'layer'

  const onChange = (event) => {
    const layerId = cleanupTargetId(event, radioButtonScope)
    selectVis(layerId)
  }

  const layerIds = Object.keys(visualisationsList)
  const available = selectedSources.includes('parkingLanes')

  if (!available)
    return (
      <div className="text-xs text-gray-400">
        <h2 className="text-base font-medium text-gray-900">Darstellung</h2>
        <p className="mt-4">
          Deaktiviert; nur für <code>parkingLanes</code> aktiv.
        </p>
      </div>
    )

  return (
    <form onChange={onChange}>
      <h2 className="text-base font-medium text-gray-900">Darstellung</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Darstellung</legend>
        <div className="space-y-2.5">
          {layerIds.map((key) => {
            const { displayName } = visualisationsList[key]
            return (
              <SelectEntryRadibutton
                scope={radioButtonScope}
                key={key}
                id={key}
                label={displayName}
                active={key === selectedVis}
              />
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
