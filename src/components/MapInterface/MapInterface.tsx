import { DebugBoxReactLocation } from '@routes/DebugBoxReactLocation'
import React from 'react'
import { MapProvider } from 'react-map-gl'
import { Map } from './Map'
import { SelectBackgroundWithLegend } from './SelectBackgroundWithLegend'
import { SelectTheme } from './SelectTheme'
import { SelectTopics } from './SelectTopics'
import { DebugBoxZustandStore } from './store'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <SelectTheme />
        <Map />
        <SelectBackgroundWithLegend />
        <SelectTopics />
        {/* <Calculator />
        <Inspector /> */}
        <DebugBoxZustandStore />
        <DebugBoxReactLocation />
      </div>
    </MapProvider>
  )
}
