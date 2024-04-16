import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from '@turf/turf'
import { type MapLibreEvent, type MapStyleImageMissingEvent } from 'maplibre-gl'
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
import { interacitvityConfiguartion } from '../../_mapData/mapDataSources/sources.const'
import { useStaticRegion } from '../regionUtils/useStaticRegion'
import { Calculator } from './Calculator/Calculator'
import { SourcesLayerRasterBackgrounds } from './SourcesAndLayers/SourcesLayerRasterBackgrounds'
import { SourcesLayersAtlasGeo } from './SourcesAndLayers/SourcesLayersAtlasGeo'
import { SourcesLayersOsmNotes } from './SourcesAndLayers/SourcesLayersOsmNotes'
import { SourcesLayersRegionMask } from './SourcesAndLayers/SourcesLayersRegionMask'
import { SourcesLayersStaticDatasets } from './SourcesAndLayers/SourcesLayersStaticDatasets'
import { roundPositionForURL } from './utils/roundNumber'
import { useInteractiveLayers } from './utils/useInteractiveLayers'
import { convertToUrlFeature, useFeaturesParam } from '../../_hooks/useQueryState/useFeaturesParam'
import { uniqBy } from 'lodash'
import { createInspectorFeatureKey } from '../utils/sourceKeyUtils/createInspectorFeatureKey'

export const Map = () => {
  const { mapParam, setMapParam } = useMapParam()
  const { setFeaturesParam } = useFeaturesParam()
  const { setInspectorFeatures, setMapLoaded, setMapDataLoading, setMapBounds } =
    useMapStateInteraction()
  const region = useStaticRegion()

  // Position the map when URL change is triggered from the outside (eg a Button that changes the URL-state to move the map)
  const { mainMap } = useMap()
  mainMap?.getMap().touchZoomRotate.disableRotation()
  // On lower zoom level, our source data is stripped down to only styling data
  // We do not show those features in our Inspector, which would show wrong data
  // However, we do want to show an interaction (Tooltip) to inform our users,
  // which is why the layers stay in `interactiveLayerIds`
  const extractInteractivFeatures = (features: MapGeoJSONFeature[] | undefined) => {
    return features?.filter(
      (f) =>
        interacitvityConfiguartion[f.sourceLayer] == undefined ||
        mapParam.zoom >= interacitvityConfiguartion[f.sourceLayer].minzoom,
    )
  }

  const [cursorStyle, setCursorStyle] = useState('grab')
  const handleMouseEnter = (event: MapLayerMouseEvent) => {
    // NOTE: Cleanup once https://github.com/visgl/react-map-gl/issues/2299 is fixed
    const features = event.features as MapGeoJSONFeature[] | undefined
    const interactiveFeatures = extractInteractivFeatures(features)
    setCursorStyle(Boolean(interactiveFeatures?.length) ? 'pointer' : 'not-allowed')
  }
  const handleMouseLeave = (_event: MapLayerMouseEvent) => {
    setCursorStyle('grab')
  }

  const handleClick = (event: MapLayerMouseEvent) => {
    const features = event.features as MapGeoJSONFeature[] | undefined
    const interactiveFeatures = extractInteractivFeatures(features)
    if (interactiveFeatures) {
      // TODO TS: Remove `as` once https://github.com/visgl/react-map-gl/issues/2299 is solved
      // NOTE: Cleanup once https://github.com/visgl/react-map-gl/issues/2299 is fixed
      setInspectorFeatures(interactiveFeatures as MapGeoJSONFeature[])
      const filteredFeatures = interactiveFeatures.filter(
        (f) => !(f.source.includes('atlas') && f.properties?.id.startsWith('relation')),
      )
      const uniqueFeatures = uniqBy(filteredFeatures, (f: MapGeoJSONFeature) =>
        createInspectorFeatureKey(f),
      )
      setFeaturesParam(
        uniqueFeatures.map((feature: MapGeoJSONFeature) => convertToUrlFeature(feature)),
      )
    }
  }

  const handleLoad = (_event: MapLibreEvent<undefined>) => {
    // Only when `loaded` all `Map` feature are actually usable (https://github.com/visgl/react-map-gl/issues/2123)
    setMapLoaded(true)
    setMapBounds(mainMap?.getBounds() || null)
  }

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
    if (mapParam?.lat === lat_ && mapParam?.lng === lng_ && mapParam?.zoom === zoom_) return
    mainMap.flyTo({
      center: [mapParam?.lng || 0, mapParam?.lat || 0],
      zoom: mapParam?.zoom || undefined,
    })
  }, [mainMap, mapParam])

  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    // Note: <SourcesAndLayersOsmNotes> simulates a moveEnd by watching the lat/lng url params
    const { latitude, longitude, zoom } = event.viewState
    const [lat_, lng_, zoom_] = roundPositionForURL(latitude, longitude, zoom)
    void setMapParam({ zoom: zoom_ ?? 2, lat: lat_ ?? 2, lng: lng_ ?? 2 }, { history: 'replace' })
    setMapBounds(mainMap?.getBounds() || null)
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
        // left: 250, breaks fitBounds()
        left: 0,
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
