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
import { useQuery } from '../store/geschichte'

export const SelectBackground: React.FC = () => {
  const { mainMap } = useMap()
  const {
    values: { currentBackground },
    pushState,
  } = useQuery()
  const radioButtonScope = 'background'

  if (!mainMap) return null

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const sourceId = cleanupTargetId(
      event,
      radioButtonScope
    ) as SourcesRasterKey
    pushState((state) => (state.currentBackground = sourceId))
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
            key={`${currentBackground}-default`}
            id="default"
            label="Standard"
            active={!!currentBackground && currentBackground === 'default'}
          />
          {sourceIds.map((key) => {
            // @ts-ignore
            const { displayName } = sourcesRaster[key]

            // TODO – This feels hacky. Research solution.
            const keyThatRerendersOnceGeschichteIsReady = `${currentBackground}-${key}`
            return (
              <SelectEntryRadibutton
                scope={radioButtonScope}
                key={keyThatRerendersOnceGeschichteIsReady}
                id={key}
                label={displayName}
                active={!!currentBackground && key === currentBackground}
              />
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
