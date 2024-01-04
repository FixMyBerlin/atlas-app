'use client'

import React from 'react'
import { MapProvider } from 'react-map-gl/maplibre'
import { DebugMap } from './DebugBoxes/DebugMap'
import { DebugStateInteraction } from './DebugBoxes/DebugStateInteraction'
import { DownloadModal } from './DownloadModal/DownloadModal'
import { Map } from './Map/Map'
import { OsmNotes } from './OsmNotes/OsmNotes'
import { SelectDatasets } from './SelectDatasets/SelectDatasets'
import { SidebarInspector } from './SidebarInspector/SidebarInspector'
import { SidebarLayerControls } from './SidebarLayerControls/SidebarLayerControls'
import { BackgroundLegend } from './background/BackgroundLegend'
import { SelectBackground } from './background/SelectBackground'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <Map />
        <SidebarLayerControls />
        <SidebarInspector />
        <div
          // The wrapper specifies the max-height which is then used by the children (mainly <SelectBackground>).
          // top-16 is the navbar, mt-2.5 is the gap given by the +/- controls.
          // The pointer-events classes make sure we can click though the empty div on the map but still use the buttons/dropdown
          className="pointer-events-none fixed bottom-4 right-2.5 top-16 z-10 mt-2.5 flex items-end justify-end gap-1.5 [&>*]:pointer-events-auto"
        >
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
