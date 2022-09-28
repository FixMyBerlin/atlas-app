import React, { useEffect } from 'react'
import { MapProvider } from 'react-map-gl'
import { Calculator } from './Calculator'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { mapDataConfig } from './Map/mapData'
import { SelectBackgroundWithLegend } from './SelectBackgroundWithLegend'
import { SelectTheme } from './SelectTheme'
import { SelectTopics } from './SelectTopics'
import {
  geschichteDefaultValues,
  GeschichteStore,
  useQuery,
  useStoreMap,
} from './store'
import { mapDataConfigTopicsWithState } from './store/mapDataConfigTopicsWithState'

export const MapInterface: React.FC = () => {
  const { values, pushState } = useQuery()
  const { initialized, setInitialized } = useStoreMap()

  useEffect(() => {
    if (initialized) return

    pushState((state) => {
      state.map = {
        lat: 52.4793,
        lng: 13.4381,
        zoom: 16,
      }
      state.config = mapDataConfigTopicsWithState({
        selectedTopicIds: ['boundaries'],
        selectedStyleKeys: [],
        selectedStylesFilterOptionKeys: [],
      })
      state.selectedBackgroundId = 'default'
      state.selectedThemeId = 'parking'
      state.selectedTopicIds = ['boundaries']
      state.selectedStyleKeys = ['parking-default']
      state.selectedStylesFilterOptionKeys = []
    })
    setInitialized(true)
  }, [initialized, pushState, setInitialized])

  if (!initialized) {
    return <h1>Loading…</h1>
  }

  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <SelectTheme />
        <Map />
        <SelectBackgroundWithLegend />
        <SelectTopics />
        <Calculator />
        <Inspector />
      </div>
    </MapProvider>
  )
}
