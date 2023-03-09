import React from 'react'
import { MapProvider } from 'react-map-gl'
import { DebugStateInteraction, DebugStateReactLocation } from './DebugBoxes'
import { DebugMap } from './DebugBoxes/DebugMap'
import { Download } from './Download'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { SelectBackgroundWithLegend } from './SelectBackgroundWithLegend'
import { SelectTheme } from './SelectTheme'
import { SelectTopics } from './SelectTopics'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <SelectTheme />
        <Map />
        <SelectBackgroundWithLegend />
        <SelectTopics />
        <Inspector />
        <Download />
        <DebugMap />
        <DebugStateInteraction />
        <DebugStateReactLocation />
      </div>
    </MapProvider>
  )
}
