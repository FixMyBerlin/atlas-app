import React from 'react'
import { useMap } from 'react-map-gl'
import { useStore } from 'zustand'
import { useStoreMap } from '../store/useStoreMap'
import {
  sourcesRaster,
  SourcesRasterKey,
} from '../Map/backgrounds/sourcesRaster.const'
import { SelectEntryRadibutton } from '../components/SelectEntry/SelectEntryRadiobutton'
import { cleanupTargetIdFromEvent } from '../Map/utils'
import { useQuery } from '../store/geschichte'

export const SelectBackground: React.FC = () => {
  const { mainMap } = useMap()
  const {
    values: { selectedBackgroundId },
    pushState,
  } = useQuery()
  const radioButtonScope = 'background'

  if (!mainMap) return null

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const sourceId = cleanupTargetIdFromEvent(
      event,
      radioButtonScope
    ) as SourcesRasterKey
    pushState((state) => (state.selectedBackgroundId = sourceId))
  }

  const sourceIds = Object.keys(sourcesRaster) as SourcesRasterKey[]

  return (
    <form onChange={onChange}>
      <h2 className="text-base font-medium text-gray-900">Hintergrundkarte</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Hintergrundkarten</legend>
        <div className="space-y-2.5">
          <SelectEntryRadibutton
            scope={radioButtonScope}
            key={`${selectedBackgroundId}-default`}
            id="default"
            label="Standard"
            active={
              !!selectedBackgroundId && selectedBackgroundId === 'default'
            }
          />
          {sourceIds.map((key) => {
            const { name } = sourcesRaster[key]

            // TODO – This feels hacky. Research solution.
            const keyThatRerendersOnceGeschichteIsReady = `${selectedBackgroundId}-${key}`
            const active =
              !!selectedBackgroundId && key === selectedBackgroundId
            return (
              <SelectEntryRadibutton
                scope={radioButtonScope}
                key={keyThatRerendersOnceGeschichteIsReady}
                id={key}
                label={name}
                active={active}
              />
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
