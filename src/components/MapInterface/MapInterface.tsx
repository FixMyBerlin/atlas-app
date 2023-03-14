import React from 'react'
import { MapProvider } from 'react-map-gl'
import { DebugStateInteraction, DebugStateReactLocation } from './DebugBoxes'
import { DebugMap } from './DebugBoxes/DebugMap'
import { Download } from './Download/Download'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { BackgroundLegend, SelectBackground } from './background'
import { SelectTheme } from './SelectTheme'
import { SelectTopics } from './SelectTopics'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <Map />
        <SelectTheme />
        <SelectTopics />
        <Inspector />
        <div className="fixed bottom-3 left-5 z-20 flex gap-2">
          <Download />
          <SelectBackground />
          <BackgroundLegend />
        </div>
        <DebugMap />
        <DebugStateInteraction />
        <DebugStateReactLocation />
      </div>
    </MapProvider>
  )
}
