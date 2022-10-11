import React from 'react'
import { MapProvider } from 'react-map-gl'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { SelectBackgroundWithLegend } from './SelectBackgroundWithLegend'
import { SelectTheme } from './SelectTheme'
import { SelectTopics } from './SelectTopics'
import { DebugBoxReactLocation, DebugBoxZustandStore } from './store'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <SelectTheme />
        <Map />
        <SelectBackgroundWithLegend />
        <SelectTopics />
        {/* <Calculator /> */}
        <Inspector />
        <DebugBoxZustandStore />
        <DebugBoxReactLocation />
      </div>
    </MapProvider>
  )
}
