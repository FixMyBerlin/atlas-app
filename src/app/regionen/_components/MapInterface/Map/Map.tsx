'use client'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as pmtiles from 'pmtiles'
import React, { useEffect, useState } from 'react'
import {
  Map as MapGl,
  MapLayerMouseEvent,
  NavigationControl,
  ViewStateChangeEvent,
  useMap,
} from 'react-map-gl/maplibre'
import { isDev } from 'src/app/_components/utils/isEnv'
import { useMapParam } from 'src/app/regionen/_components/useQueryState/useMapParam'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'
import { Calculator } from './Calculator/Calculator'
import { SourcesAndLayers } from './SourcesAndLayers/SourcesAndLayers'
import { SourcesLayerDatasets } from './SourcesAndLayers/SourcesLayerDatasets'
import { SourcesLayerRasterBackgrounds } from './SourcesAndLayers/SourcesLayerRasterBackgrounds'
import { SourcesLayerRegionalMask } from './SourcesAndLayers/SourcesLayerRegionalMask'
import { SourcesLayersOsmNotes } from './SourcesAndLayers/SourcesLayersOsmNotes'
import { roundPositionForURL } from './utils/roundNumber'
import { useInteractiveLayers } from './utils/useInteractiveLayers'
import { useMissingImage } from './utils/useMissingImage'
import { MapGeoJSONFeature } from 'react-map-gl'

export const Map: React.FC = () => {
  const { mapParam, setMapParam } = useMapParam()

  const [cursorStyle, setCursorStyle] = useState('grab')

  const { setInspector, setMapLoaded, setPmTilesProtocolReady } = useMapStateInteraction()

  const handleMouseEnter = (_event: MapLayerMouseEvent) => {
    setCursorStyle('pointer')
  }
  const handleMouseLeave = (_event: MapLayerMouseEvent) => {
    setCursorStyle('grab')
  }

  const handleClick = (event: MapLayerMouseEvent) => {
    // TODO TS: Remove `as` once https://github.com/visgl/react-map-gl/issues/2299 is solved
    event.features && setInspector(event.features as MapGeoJSONFeature[])
  }

  const handleLoad = (_event: MapLibreEvent<undefined>) => {
    // Only when `loaded` all `Map` feature are actually usable (https://github.com/visgl/react-map-gl/issues/2123)
    setMapLoaded(true)

    // Add PMTiles Protocol to be use by "Datasets"
    // Docs https://maplibre.org/maplibre-gl-js-docs/api/properties/#addprotocol
    const protocol = new pmtiles.Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    setPmTilesProtocolReady(true)

    if (isDev) {
      // About: Whenever we change the base style, the "beforeId" in 'Map/backgrounds/beforeId.const.ts'
      //  needs to be updated. The following code shows a list of all "external" layers.
      // const style = _event.target.getStyle()
      // const allLayer = style.layers
      // // @ts-ignore: 'AnyLayer' not relevant here
      // const basemapLayer = allLayer.filter((l) => l.source === 'openmaptiles')
      // console.log({ findBeforeIds: basemapLayer, allLayer })
    }
  }

  // Position the map when URL change is triggered from the outside (eg a Button that changes the URL-state to move the map)
  const { mainMap } = useMap()
  mainMap?.getMap().touchZoomRotate.disableRotation()

  useMissingImage(mainMap)

  useEffect(() => {
    if (!mainMap) return

    const mapCenter = mainMap.getCenter()
    const mapZoom = mainMap.getZoom()

    const [lat_, lng_, zoom_] = roundPositionForURL(mapCenter.lat, mapCenter.lng, mapZoom)

    if (mapParam?.lat == lat_ && mapParam?.lng == lng_ && mapParam?.zoom == zoom_) return

    mainMap.flyTo({
      center: [mapParam?.lng || 0, mapParam?.lat || 0],
      zoom: mapParam?.zoom,
    })
  }, [mainMap, mapParam])

  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    // Note: <SourcesAndLayersOsmNotes> simulates a moveEnd by watching the lat/lng url params

    const { latitude, longitude, zoom } = event.viewState
    const [lat_, lng_, zoom_] = roundPositionForURL(latitude, longitude, zoom)
    // TODO MIGRATION: Test out if this secondary param actually works …
    void setMapParam({ zoom: zoom_ ?? 2, lat: lat_ ?? 2, lng: lng_ ?? 2 }, { history: 'replace' })
  }

  const interactiveLayerIds = useInteractiveLayers()

  if (!mapParam) {
    return null
  }

  return (
    <MapGl
      id="mainMap"
      initialViewState={{
        longitude: mapParam.lng,
        latitude: mapParam.lat,
        zoom: mapParam.zoom,
      }}
      // hash // we cannot use the hash prop because it interfiers with our URL based states; we recreate the same behavior manually
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://api.maptiler.com/maps/5cff051f-e5ca-43cf-b030-1f0286c59bb3/style.json?key=ECOoUBmpqklzSCASXxcu"
      // mapStyle="mapbox://styles/hejco/cl706a84j003v14o23n2r81w7"
      // mapboxAccessToken="pk.eyJ1IjoiaGVqY28iLCJhIjoiY2piZjd2bzk2MnVsMjJybGxwOWhkbWxpNCJ9.L1UNUPutVJHWjSmqoN4h7Q"
      interactiveLayerIds={interactiveLayerIds}
      // onMouseMove={}
      // onLoad={handleInspect}
      cursor={cursorStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMoveEnd={handleMoveEnd}
      // onZoomEnd={handleZoomEnd} // zooming is always also moving
      onClick={handleClick}
      onLoad={handleLoad}
      doubleClickZoom={true}
      dragRotate={false}
    >
      {/* Order: First Background Sources, then Vector Tile Sources */}
      <SourcesLayerRasterBackgrounds />
      <SourcesLayerRegionalMask />
      <SourcesAndLayers />
      <SourcesLayerDatasets />
      <SourcesLayersOsmNotes />

      <NavigationControl showCompass={false} />
      <Calculator />
      {/* <GeolocateControl /> */}
      {/* <ScaleControl /> */}
    </MapGl>
  )
}
