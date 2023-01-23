import { getStyleData, getTopicData } from '@components/MapInterface/mapData'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { useNavigate, useSearch } from '@tanstack/react-location'
import bbox from '@turf/bbox'
import booleanIntersects from '@turf/boolean-intersects'
import mapboxgl from 'mapbox-gl'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect, useState } from 'react'
import {
  Map as MapGl,
  MapboxEvent,
  MapLayerMouseEvent,
  NavigationControl,
  useMap,
  ViewStateChangeEvent,
} from 'react-map-gl'
import { LocationGenerics } from '../../../routes'
import { useMapStateInteraction } from '../mapStateInteraction'
import { createSourceTopicStyleLayerKey } from '../utils'
import { SourcesLayerRasterBackgrounds } from './backgrounds'
import { DrawControl, DrawFeature } from './DrawControl'
import { SourceAndLayers } from './SourceAndLayers'
import { roundPositionForURL } from './utils'

export const Map: React.FC = () => {
  const {
    theme: _theme,
    lat,
    lng,
    zoom,
    bg: _selectedBackgroundId,
    config: _TODO_config,
  } = useSearch<LocationGenerics>()

  const [cursorStyle, setCursorStyle] = useState('grab')
  const [loaded, setLoaded] = useState(false)

  const {
    setInspector,
    addToCalculator,
    removeFromCalculator,
    calculatorFeatures,
  } = useMapStateInteraction()

  const handleMouseEnter = (_event: MapLayerMouseEvent) => {
    setCursorStyle('pointer')
  }
  const handleMouseLeave = (_event: MapLayerMouseEvent) => {
    setCursorStyle('grab')
  }
  const handleClick = (event: MapLayerMouseEvent) => {
    event.features && setInspector(event.features)
  }
  const handleDoubleClick = (event: MapLayerMouseEvent) => {
    if (!event.features) return

    const alreadySelectedIds = calculatorFeatures.map((f) => f?.properties?.id)
    event.features.forEach((f) => {
      if (alreadySelectedIds.includes(f?.properties?.id)) {
        removeFromCalculator(f)
      } else {
        addToCalculator([f])
      }
    })
  }

  // keeping this for debugging purposes for now
  const handleLoad = (_event: MapboxEvent) => {
    // About: Whenever we change the base style, the "beforeId" in 'Map/backgrounds/beforeId.const.ts'
    //  needs to be updated. The following code shows a list of all "external" layers.
    const style = _event.target.getStyle()
    const allLayer = style.layers
    // @ts-ignore: 'AnyLayer' not relevant here
    const basemapLayer = allLayer.filter((l) => l.source === 'openmaptiles')
    console.log({ findBeforeIds: basemapLayer, allLayer })
    setLoaded(true)
  }

  // Position the map when URL change is triggered from the outside (eg a Button that changes the URL-state to move the map)
  const { mainMap } = useMap()
  mainMap?.getMap().touchZoomRotate.disableRotation()

  useEffect(() => {
    if (!mainMap) return

    const mapCenter = mainMap.getCenter()
    const mapZoom = mainMap.getZoom()

    const [lat_, lng_, zoom_] = roundPositionForURL(
      mapCenter.lat,
      mapCenter.lng,
      mapZoom
    )

    if (lat == lat_ && lng == lng_ && zoom == zoom_) return

    mainMap.flyTo({
      center: [lng || 0, lat || 0],
      zoom: zoom,
    })
  }, [lat, lng, zoom])

  const navigate = useNavigate<LocationGenerics>()
  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    const { latitude, longitude, zoom } = event.viewState
    const [lat_, lng_, zoom_] = roundPositionForURL(latitude, longitude, zoom)
    navigate({
      search: (old) => ({ ...old, lat: lat_, lng: lng_, zoom: zoom_ }),
      replace: true,
    })
  }

  const { config: configThemesTopics, theme: themeId } =
    useSearch<LocationGenerics>()
  const currentTheme = configThemesTopics?.find((th) => th.id === themeId)
  if (!configThemesTopics || !currentTheme) return null

  const interactiveLayerIds: string[] = []
  currentTheme.topics.forEach((topicConfig) => {
    // Guard: Only pick layer that are part of our current theme

    if (!currentTheme?.topics.some((t) => t.id === topicConfig.id)) return
    const topicData = getTopicData(topicConfig.id)

    topicConfig.styles.map((styleConfig) => {
      const styleData = getStyleData(topicData, styleConfig.id)
      styleData.layers.forEach((layerConfig) => {
        const layerKey = createSourceTopicStyleLayerKey(
          topicData.sourceId,
          topicConfig.id,
          styleConfig.id,
          layerConfig.id
        )
        interactiveLayerIds.push(layerKey)
      })
    })
  })

  if (lat === undefined || lng === undefined || zoom === undefined) {
    return null
  }

  const [selectArea, setSelectArea] = useState<DrawFeature[]>([])

  const onUpdate = (e: { features: DrawFeature[] }) => {
    setSelectArea((currFeatures) => {
      const reallyNew = e.features.filter(
        (nf) => !currFeatures.some((cf) => cf.id === nf.id)
      )
      return [...currFeatures, ...reallyNew]
    })
  }

  const drawRef = React.useRef<MapboxDraw>()
  useEffect(() => {
    console.log('selectArea useEffect', { selectArea })

    const first = selectArea?.at(0)
    if (first && mainMap) {
      const polygonBbox = bbox(first)
      console.log(polygonBbox)

      const southWest: mapboxgl.LngLatLike = [polygonBbox[0], polygonBbox[1]]
      const northEast: mapboxgl.LngLatLike = [polygonBbox[2], polygonBbox[3]]

      const northEastPointPixel = mainMap.project(northEast)
      const southWestPointPixel = mainMap.project(southWest)

      const features = mainMap.queryRenderedFeatures(
        [southWestPointPixel, northEastPointPixel],
        {
          layers: [
            'parkraumParkingPoints--parkingPoints--default--parkraumParkingPointsLayer',
          ],
        }
      )

      const filteredFeatures = features
        .map((feature) => {
          if (booleanIntersects(feature, first)) {
            return feature
          }
        })
        .filter(
          (feature): feature is mapboxgl.MapboxGeoJSONFeature => !!feature
        )

      console.info('user selected polygon', first, polygonBbox)
      console.info('date for polygon', features, features?.at(0))
      console.info('setFilter counties-highlighted to', filteredFeatures)

      addToCalculator(filteredFeatures)
    }

    // Dont need this, this will collect too much data
    // const querySourceFeatures =
    //   mainMap &&
    //   mainMap.querySourceFeatures(
    //     'source:parkraumParkingPoints--topic:parkingPoints--tiles',
    //     { sourceLayer: 'public.parking_spaces' }
    //   )
    // console.log({ querySourceFeatures })

    // Does this work; throw away…
    // mainMap.querySourceFeatures(
    //   'source:parkraumParking--topic:parking--tiles',
    //   { sourceLayer: 'public.parking_segments' }
    // )

    // addToCalculator
  }, [selectArea])

  const onDelete = (e: { features: DrawFeature[] }) => {
    setSelectArea((currFeatures) => {
      const deletedFeaturesIds = e.features.map((f) => f.id)
      return [...currFeatures].filter(
        (feature) => !deletedFeaturesIds.includes(feature.id)
      )
    })
  }

  console.log('selectArea', selectArea)
  console.log('y', { drawRef })

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
      interactiveLayerIds={loaded ? interactiveLayerIds : []}
      // onMouseMove={}
      // onLoad={handleInspect}
      cursor={cursorStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMoveEnd={handleMoveEnd}
      // onZoomEnd={handleZoomEnd} // zooming is always also moving
      onClick={handleClick}
      onDblClick={handleDoubleClick}
      onLoad={handleLoad}
      doubleClickZoom={false}
      dragRotate={false}
    >
      <SourceAndLayers />
      <SourcesLayerRasterBackgrounds />
      <NavigationControl showCompass={false} />
      <DrawControl
        drawRef={drawRef}
        position="top-right"
        displayControlsDefault={false}
        controls={{
          polygon: true,
          trash: true,
        }}
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
      {/* <GeolocateControl /> */}
      {/* <ScaleControl /> */}
    </MapGl>
  )
}
