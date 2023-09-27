import React from 'react'
import { MapProvider } from 'react-map-gl'
import { DebugStateInteraction } from './DebugBoxes/DebugStateInteraction'
import { DebugMap } from './DebugBoxes/DebugMap'
import { DownloadModal } from './DownloadModal/DownloadModal'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { MapSidebar } from './MapSidebar/MapSidebar'
import { OsmNotes } from './OsmNotes'
import { SelectDatasets } from './SelectDatasets/SelectDatasets'
import { BackgroundLegend, SelectBackground } from './background'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <Map />
        <MapSidebar />
        <Inspector />
        <div className="fixed bottom-4 right-2.5 z-0 flex gap-1.5  ">
          <OsmNotes />
          <DownloadModal />
          <SelectDatasets />
          <SelectBackground />
          <BackgroundLegend />
        </div>
        <DebugMap />
        <DebugStateInteraction />
      </div>
    </MapProvider>
  )
}
