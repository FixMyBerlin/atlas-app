'use client'

import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import { useEffect } from 'react'
import { MapProvider } from 'react-map-gl/maplibre'
import { DebugMap } from './DebugBoxes/DebugMap'
import { DebugStateInteraction } from './DebugBoxes/DebugStateInteraction'
import { DownloadModal } from './DownloadModal/DownloadModal'
import { LoadingIndicator } from './LoadingIndicator/LoadingIndicator'
import { Map } from './Map/Map'
import { SidebarInspector } from './SidebarInspector/SidebarInspector'
import { SidebarLayerControls } from './SidebarLayerControls/SidebarLayerControls'
import { BackgroundLegend } from './background/BackgroundLegend'
import { SelectBackground } from './background/SelectBackground'
import { OsmNotes } from './notes/OsmNotes/OsmNotes'
import { AtlasNotes } from './notes/AtlasNotes/AtlasNotes'

export const MapInterface = () => {
  // Add PMTiles Protocol to be use by "Datasets"
  // Docs https://docs.protomaps.com/pmtiles/maplibre#react
  useEffect(() => {
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    return () => {
      maplibregl.removeProtocol('pmtiles')
    }
  }, [])

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
          <LoadingIndicator />
          <OsmNotes />
          <AtlasNotes />
          <DownloadModal />
          <SelectBackground />
          <BackgroundLegend />
        </div>
        <DebugMap />
        <DebugStateInteraction />
      </div>
    </MapProvider>
  )
}
