import { isDev } from 'src/core/utils'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { useNavigate, useSearch } from '@tanstack/react-location'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as pmtiles from 'pmtiles'
import React, { useEffect, useState } from 'react'
import {
  Map as MapGl,
  MapLayerMouseEvent,
  MapboxEvent,
  NavigationControl,
  ViewStateChangeEvent,
  useMap,
} from 'react-map-gl'
import { LocationGenerics } from '../../../../TODO-MIRGRATE-REMOVE'
import { useMapStateInteraction } from '../mapStateInteraction'
import { Calculator } from './Calculator/Calculator'
import {
  SourcesAndLayers,
  SourcesLayerDatasets,
  SourcesLayerRasterBackgrounds,
} from './SourcesAndLayers'
import { SourcesLayerRegionalMask } from './SourcesAndLayers/SourcesLayerRegionalMask'
import { SourcesLayersOsmNotes } from './SourcesAndLayers/SourcesLayersOsmNotes'
import { roundPositionForURL } from './utils'
import { useInteractiveLayers } from './utils/useInteractiveLayers'
import { useMissingImage } from './utils/useMissingImage'

export const Map: React.FC = () => {
  const {
    lat,
    lng,
    zoom,
    bg: _selectedBackgroundId,
    config: _TODO_config,
  } = useSearch<LocationGenerics>()

  const [cursorStyle, setCursorStyle] = useState('grab')

  const { setInspector, setMapLoaded, setPmTilesProtocolReady } = useMapStateInteraction()

  const handleMouseEnter = (_event: MapLayerMouseEvent) => {
    setCursorStyle('pointer')
  }
  const handleMouseLeave = (_event: MapLayerMouseEvent) => {
    setCursorStyle('grab')
  }
  const handleClick = (event: MapLayerMouseEvent) => {
    event.features && setInspector(event.features)
  }

  const handleLoad = (_event: MapboxEvent) => {
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

    if (lat == lat_ && lng == lng_ && zoom == zoom_) return

    mainMap.flyTo({
      center: [lng || 0, lat || 0],
      zoom: zoom,
    })
  }, [lat, lng, zoom])

  const navigate = useNavigate<LocationGenerics>()
  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    // Note: <SourcesAndLayersOsmNotes> simulates a moveEnd by watching the lat/lng url params

    const { latitude, longitude, zoom } = event.viewState
    const [lat_, lng_, zoom_] = roundPositionForURL(latitude, longitude, zoom)
    navigate({
      search: (old) => ({ ...old, lat: lat_, lng: lng_, zoom: zoom_ }),
      replace: true,
    })
  }

  const interactiveLayerIds = useInteractiveLayers()

  if (lat === undefined || lng === undefined || zoom === undefined) {
    return null
  }

  return (
    <MapGl
      id="mainMap"
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: zoom,
      }}
      // hash // we cannot use the hash prop because it interfiers with our URL based states; we recreate the same behavior manually
      style={{ width: '100%', height: '100%' }}
      mapLib={maplibregl}
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
