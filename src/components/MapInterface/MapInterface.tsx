import React from 'react'
import { MapProvider } from 'react-map-gl'
import { DebugStateInteraction, DebugStateReactLocation } from './DebugBoxes'
import { DebugMap } from './DebugBoxes/DebugMap'
import { Download } from './Download/Download'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { SelectDatasets } from './SelectDatasets/SelectDatasets'
import { SelectTheme } from './SelectTheme'
import { SelectTopics } from './SelectTopics'
import { ShowOsmNotes } from './ShowOsmNotes'
import { BackgroundLegend, SelectBackground } from './background'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <Map />
        <div className="absolute top-3 left-5 z-10 flex gap-2">
          <SelectTheme />
          <ShowOsmNotes />
        </div>
        <SelectTopics />
        <Inspector />
        <div className="fixed bottom-4 right-2.5 z-20 flex gap-1.5  ">
          <Download />
          <SelectDatasets />
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
