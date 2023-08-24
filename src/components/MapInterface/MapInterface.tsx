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
import { OsmNotes } from './OsmNotes'
import { BackgroundLegend, SelectBackground } from './background'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <Map />
        <div className="absolute top-2.5 left-[17rem] z-10 flex gap-2">
          <SelectTheme />
        </div>
        <SelectTopics />
        <Inspector />
        <div className="fixed bottom-4 right-2.5 z-0 flex gap-1.5  ">
          <OsmNotes />
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
