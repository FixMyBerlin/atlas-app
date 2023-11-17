'use client'

import React from 'react'
import { MapProvider } from 'react-map-gl/maplibre'
import { useRegion } from 'src/app/(pages)/_components/regionUtils/useRegion'
import { useConfigParam } from '../_hooks/useQueryState/useConfigParam'
import { useMapParam } from '../_hooks/useQueryState/useMapParam'
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
import { createMapRegionConfig } from './mapStateConfig/createMapRegionConfig'

export const MapInterface: React.FC = () => {
  const region = useRegion()
  const { mapParam } = useMapParam(region.map)
  const { configParam } = useConfigParam(createMapRegionConfig(region.themes))
  console.log('## MapInterface rendered', mapParam, configParam)
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <Map />
        <SidebarLayerControls />
        <SidebarInspector />
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
