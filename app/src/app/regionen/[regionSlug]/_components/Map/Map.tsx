import * as turf from '@turf/turf'
import { uniqBy, differenceBy } from 'lodash'
import { type MapLibreEvent, MapMouseEvent, type MapStyleImageMissingEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef, useState } from 'react'
import {
  AttributionControl,
  MapGeoJSONFeature,
  Map as MapGl,
  MapLayerMouseEvent,
  NavigationControl,
  ViewStateChangeEvent,
  useMap,
} from 'react-map-gl/maplibre'
import { isDev } from 'src/app/_components/utils/isEnv'
import { useMapParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import { useMapInspectorFeatures, useMapActions } from '../../_hooks/mapState/useMapState'
import {
  convertToUrlFeature,
  useFeaturesParam,
} from '../../_hooks/useQueryState/useFeaturesParam/useFeaturesParam'
import { interactivityConfiguration } from '../../_mapData/mapDataSources/generalization/interacitvityConfiguartion'
import { useStaticRegion } from '../regionUtils/useStaticRegion'
import { createInspectorFeatureKey } from '../utils/sourceKeyUtils/createInspectorFeatureKey'
import { isSourceKeyAtlasGeo } from '../utils/sourceKeyUtils/sourceKeyUtilsAtlasGeo'
import { Calculator } from './Calculator/Calculator'
import { SourceGeojson } from './SourcesAndLayers/SourceGeojson/SourceGeojson'
import { SourcesLayerRasterBackgrounds } from './SourcesAndLayers/SourcesLayerRasterBackgrounds'
import { SourcesLayersAtlasGeo } from './SourcesAndLayers/SourcesLayersAtlasGeo'
import { SourcesLayersOsmNotes } from './SourcesAndLayers/SourcesLayersOsmNotes'
import { SourcesLayersRegionMask } from './SourcesAndLayers/SourcesLayersRegionMask'
import { SourcesLayersStaticDatasets } from './SourcesAndLayers/SourcesLayersStaticDatasets'
import { useInteractiveLayers } from './utils/useInteractiveLayers'
import { useBreakpoint } from '../utils/useBreakpoint'
import { SourcesLayersAtlasNotes } from './SourcesAndLayers/SourcesLayersAtlasNotes'
import { UpdateFeatureState } from './UpdateFeatureState'

// On lower zoom level, our source data is stripped down to only styling data
// We do not show those features in our Inspector, which would show wrong data
// However, we do want to show an interaction (Tooltip) to inform our users,
// which is why the layers stay in `interactiveLayerIds`
const extractInteractiveFeatures = (
  mapParam,
  features: MapGeoJSONFeature[] | undefined,
): MapGeoJSONFeature[] => {
  if (!features) return []
  return features?.filter(({ sourceLayer }) => {
    sourceLayer = String(sourceLayer)
    return (
      !(sourceLayer in interactivityConfiguration) ||
      mapParam.zoom >= interactivityConfiguration[sourceLayer].minzoom
    )
  })
}

export const Map = () => {
  const { mapParam, setMapParam } = useMapParam()
  const { setFeaturesParam } = useFeaturesParam()
  const {
    setInspectorFeatures,
    resetInspectorFeatures,
    setMapLoaded,
    setMapDataLoading,
    setMapBounds,
  } = useMapActions()
  const isSmBreakpointOrAbove = useBreakpoint('sm')
  const region = useStaticRegion()
  const [cursorStyle, setCursorStyle] = useState('grab')

  // Position the map when URL change is triggered from the outside (eg a Button that changes the URL-state to move the map)
  const { mainMap } = useMap()
  mainMap?.getMap().touchZoomRotate.disableRotation()

  const containMaskFeature = (features: MapLayerMouseEvent['features']) => {
    if (!features) return false
    return features.some((f) => f.source === 'mask')
  }

  const inspectorFeatures = useMapInspectorFeatures()

  const handleClick = ({ features, ...event }: MapLayerMouseEvent) => {
    if (containMaskFeature(features)) {
      return
    }
    const interactiveFeatures = extractInteractiveFeatures(mapParam, features)
    const uniqueFeatures = uniqBy(interactiveFeatures, (f) => createInspectorFeatureKey(f))

    if (uniqueFeatures) {
      let newInspectorFeatures: MapGeoJSONFeature[] = []
      if (event.originalEvent.ctrlKey) {
        // ctrl is down - toggle features
        const featureInArray = (f0, farr) =>
          !!farr.find((f1) => f0.properties.id === f1.properties.id)
        const keepFeatures = inspectorFeatures.filter((f) => !featureInArray(f, uniqueFeatures))
        const addFeatures = uniqueFeatures.filter((f) => !featureInArray(f, inspectorFeatures))
        newInspectorFeatures = [...keepFeatures, ...addFeatures]
      } else {
        // ctrl is not down - just set features
        newInspectorFeatures = uniqueFeatures
      }
      setInspectorFeatures(newInspectorFeatures)

      const persistableFeatures = newInspectorFeatures.filter((f) => isSourceKeyAtlasGeo(f.source))
      if (persistableFeatures.length) {
        setFeaturesParam(persistableFeatures.map((feature) => convertToUrlFeature(feature)))
      } else {
        setFeaturesParam(null)
      }
    } else {
      resetInspectorFeatures()
    }
  }

  const updateCursor = (features: MapGeoJSONFeature[] | undefined) => {
    if (!features || !features.length) {
      setCursorStyle('grab')
      return
    }
    if (containMaskFeature(features)) {
      setCursorStyle('not-allowed')
      return
    }
    setCursorStyle(features.length ? 'pointer' : 'not-allowed')
  }

  const hoveredFeatures = useRef<MapGeoJSONFeature[]>([])
  const key = ({ id, layer }: MapGeoJSONFeature) => `${id}>${layer.id}`
  const updateHover = (features: MapGeoJSONFeature[] | undefined) => {
    if (containMaskFeature(features)) features = []
    const previous = hoveredFeatures.current
    const current = features || []
    differenceBy(previous, current, key).forEach((f) => {
      mainMap?.setFeatureState(f, { hover: false })
    })
    differenceBy(current, previous, key).forEach((f) => {
      mainMap?.setFeatureState(f, { hover: true })
    })
    hoveredFeatures.current = current
  }

  const getFeatures = (e: MapMouseEvent) =>
    mainMap?.queryRenderedFeatures([e.point.x, e.point.y], {
      layers: interactiveLayerIds,
    }) || []

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const features = extractInteractiveFeatures(mapParam, getFeatures(e))
    updateCursor(features)
    updateHover(features)
  }

  const handleMouseLeave = (e: MapLayerMouseEvent) => {
    const features = extractInteractiveFeatures(mapParam, getFeatures(e))
    updateCursor(features)
    updateHover(features)
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

  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    // Note: <SourcesAndLayersOsmNotes> simulates a moveEnd by watching the lat/lng url params
    const { latitude, longitude, zoom } = event.viewState
    void setMapParam({ zoom, lat: latitude, lng: longitude }, { history: 'replace' })
    setMapBounds(mainMap?.getBounds() || null)
  }

  const interactiveLayerIds = [
    ...useInteractiveLayers(),
    'mask-buffer',
    'mask-boundary',
    'mask-boundary-bg',
  ]

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
      onMoveEnd={handleMoveEnd}
      // onZoomEnd={} // zooming is always also moving
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
      <UpdateFeatureState />
      <SourcesLayerRasterBackgrounds />
      <SourcesLayersRegionMask />
      <SourcesLayersAtlasGeo />
      <SourcesLayersStaticDatasets />
      <SourcesLayersOsmNotes />
      <SourcesLayersAtlasNotes />
      {isDev ? <SourceGeojson /> : null}
      <AttributionControl compact={true} position="bottom-left" />

      <NavigationControl showCompass={false /* TODO: See Story */} visualizePitch={true} />
      <Calculator />
      {/* <GeolocateControl /> */}
      {/* <ScaleControl /> */}
    </MapGl>
  )
}
