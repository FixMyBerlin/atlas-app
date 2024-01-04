import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import maplibregl, { MapLibreEvent, MapStyleImageMissingEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as pmtiles from 'pmtiles'
import React, { useEffect, useState } from 'react'
import { MapGeoJSONFeature } from 'react-map-gl'
import {
  Map as MapGl,
  MapLayerMouseEvent,
  NavigationControl,
  ViewStateChangeEvent,
  useMap,
} from 'react-map-gl/maplibre'
import { isDev } from 'src/app/_components/utils/isEnv'
import { useMapParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { Calculator } from './Calculator/Calculator'
import { SourcesAndLayers } from './SourcesAndLayers/SourcesAndLayers'
import { SourcesLayerDatasets } from './SourcesAndLayers/SourcesLayerDatasets'
import { SourcesLayerRasterBackgrounds } from './SourcesAndLayers/SourcesLayerRasterBackgrounds'
import { SourcesLayerRegionalMask } from './SourcesAndLayers/SourcesLayerRegionalMask'
import { SourcesLayersOsmNotes } from './SourcesAndLayers/SourcesLayersOsmNotes'
import { roundPositionForURL } from './utils/roundNumber'
import { useInteractiveLayers } from './utils/useInteractiveLayers'

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

  // Warn when a sprite image is missing
  useEffect(() => {
    if (!mainMap) return
    mainMap.on('styleimagemissing', (e: MapStyleImageMissingEvent) => {
      const imageId = e.id
      if (imageId === 'null') return // Conditional images with Fallback images "Fill pattern: none" result in e.id=NULL
      console.warn('Missing image', imageId)
    })
  }, [mainMap])

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
      mapStyle={process.env.NEXT_PUBLIC_APP_ORIGIN + '/api/map/style'}
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
      // @ts-expect-error: See https://github.com/visgl/react-map-gl/issues/2310
      RTLTextPlugin={null}
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
