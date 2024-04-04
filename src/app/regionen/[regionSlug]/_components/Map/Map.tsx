import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from '@turf/turf'
import { MapLibreEvent, MapStyleImageMissingEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import { MapGeoJSONFeature } from 'react-map-gl'
import {
  AttributionControl,
  Map as MapGl,
  MapLayerMouseEvent,
  NavigationControl,
  ViewStateChangeEvent,
  useMap,
} from 'react-map-gl/maplibre'
import { isDev } from 'src/app/_components/utils/isEnv'
import { useMapParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useStaticRegion } from '../regionUtils/useStaticRegion'
import { Calculator } from './Calculator/Calculator'
import { SourcesLayerRasterBackgrounds } from './SourcesAndLayers/SourcesLayerRasterBackgrounds'
import { SourcesLayersAtlasGeo } from './SourcesAndLayers/SourcesLayersAtlasGeo'
import { SourcesLayersOsmNotes } from './SourcesAndLayers/SourcesLayersOsmNotes'
import { SourcesLayersRegionMask } from './SourcesAndLayers/SourcesLayersRegionMask'
import { SourcesLayersStaticDatasets } from './SourcesAndLayers/SourcesLayersStaticDatasets'
import { roundPositionForURL } from './utils/roundNumber'
import { useInteractiveLayers } from './utils/useInteractiveLayers'

export const Map = () => {
  const { mapParam, setMapParam } = useMapParam()
  const { setInspectorFeatures, setMapLoaded, setMapDataLoading } = useMapStateInteraction()
  const region = useStaticRegion()

  const [cursorStyle, setCursorStyle] = useState('grab')
  const handleMouseEnter = (_event: MapLayerMouseEvent) => {
    setCursorStyle('pointer')
  }
  const handleMouseLeave = (_event: MapLayerMouseEvent) => {
    setCursorStyle('grab')
  }

  const handleClick = (event: MapLayerMouseEvent) => {
    // TODO TS: Remove `as` once https://github.com/visgl/react-map-gl/issues/2299 is solved
    event.features && setInspectorFeatures(event.features as MapGeoJSONFeature[])
  }

  const handleLoad = (_event: MapLibreEvent<undefined>) => {
    // Only when `loaded` all `Map` feature are actually usable (https://github.com/visgl/react-map-gl/issues/2123)
    setMapLoaded(true)
  }

  // Position the map when URL change is triggered from the outside (eg a Button that changes the URL-state to move the map)
  const { mainMap } = useMap()
  mainMap?.getMap().touchZoomRotate.disableRotation()

  // Warn when a sprite image is missing
  useEffect(() => {
    if (!mainMap) return
    if (!isDev) return
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

  let mapMaxBoundsSettings: ReturnType<typeof turf.bbox> | {} = {}
  if (region?.bbox) {
    const maxBounds = [
      region.bbox.min[0],
      region.bbox.min[1],
      region.bbox.max[0],
      region.bbox.max[1],
    ] satisfies ReturnType<typeof turf.bbox>
    mapMaxBoundsSettings = {
      // Buffer is in km to add the mask buffer and some more
      maxBounds: turf.bbox(turf.buffer(turf.bboxPolygon(maxBounds), 40, { units: 'kilometers' })),
      // Padding is in pixel to make sure the map controls are visible
      padding: {
        // TODO: We might need different padding on mobile…
        top: 0,
        bottom: 0,
        left: 250,
        right: 0,
      },
    }
  }

  return (
    <MapGl
      id="mainMap"
      initialViewState={{
        longitude: mapParam.lng,
        latitude: mapParam.lat,
        zoom: mapParam.zoom,
      }}
      // We prevent users from zooming out too far which puts too much load on our vector tiles db
      {...mapMaxBoundsSettings}
      // hash // we cannot use the hash prop because it interfiers with our URL based states; we recreate the same behavior manually
      style={{ width: '100%', height: '100%' }}
      mapStyle={process.env.NEXT_PUBLIC_APP_ORIGIN + '/api/map/style'}
      interactiveLayerIds={interactiveLayerIds}
      // onMouseMove={}
      // onLoad={handleInspect}
      cursor={cursorStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMoveEnd={handleMoveEnd}
      // onZoomEnd={} // zooming is always also moving
      onClick={handleClick}
      onLoad={handleLoad}
      onData={() => setMapDataLoading(true)}
      onIdle={() => setMapDataLoading(false)}
      doubleClickZoom={true}
      dragRotate={false}
      // @ts-expect-error: See https://github.com/visgl/react-map-gl/issues/2310
      RTLTextPlugin={null}
      minZoom={3}
      attributionControl={false}
    >
      {/* Order: First Background Sources, then Vector Tile Sources */}
      <SourcesLayerRasterBackgrounds />
      <SourcesLayersRegionMask />
      <SourcesLayersAtlasGeo />
      <SourcesLayersStaticDatasets />
      <SourcesLayersOsmNotes />
      <AttributionControl compact={true} position="bottom-left" />

      <NavigationControl showCompass={false} />
      <Calculator />
      {/* <GeolocateControl /> */}
      {/* <ScaleControl /> */}
    </MapGl>
  )
}
