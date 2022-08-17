import React from 'react'
import { useMap } from 'react-map-gl'
import { useStore } from 'zustand'
import { useStoreMap } from '../store/useStoreMap'
import {
  sourcesRaster,
  SourcesRasterKey,
} from '../Map/backgrounds/sourcesRaster.const'
import { SelectEntryRadibutton } from '../components/SelectEntry/SelectEntryRadiobutton'
import { cleanupTargetId } from '../Map/utils'

export const SelectBackground: React.FC = () => {
  const { mainMap } = useMap()
  const { selectedBackground, selectBackground: setActiveBackground } =
    useStore(useStoreMap)
  const radioButtonScope = 'background'

  if (!mainMap) return null

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const sourceId = cleanupTargetId(
      event,
      radioButtonScope
    ) as SourcesRasterKey
    setActiveBackground(sourceId)
  }

  const sourceIds = Object.keys(sourcesRaster) as SourcesRasterKey[]
  // NOTE: Mega weird. Crasht die Karte aus unerfindlichen Gründen. Erstmal weg gelassen, da theoretisch der Check nicht nötig sein müsste, weil eigentlich immer alles schon ein aktiver Layer sein müsste zu dieser Zeit.
  //   .filter(
  //   (sourceId) => {
  //     const layerId = layerIdFromSourceId(sourceId)
  //     console.log({
  //       sourceId,
  //       layerId,
  //       mainMap,
  //       true: mainMap.getLayer(layerId),
  //       all: mainMap.getStyle().layers,
  //     })
  //     return mainMap.getLayer(layerId)
  //   }
  // )

  return (
    <form onChange={onChange}>
      <h2 className="text-base font-medium text-gray-900">Hintergrundkarte</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Hintergrundkarten</legend>
        <div className="space-y-2.5">
          <SelectEntryRadibutton
            scope={radioButtonScope}
            id="default"
            label="Standard"
            active={selectedBackground === null}
          />
          {sourceIds.map((key) => {
            // @ts-ignore
            const { displayName } = sourcesRaster[key]

            return (
              <SelectEntryRadibutton
                scope={radioButtonScope}
                key={key}
                id={key}
                label={displayName}
                active={key === selectedBackground}
              />
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
