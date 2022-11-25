import { useNavigate, useSearch } from '@tanstack/react-location'
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
import { SourcesLayerRasterBackgrounds } from './backgrounds'
import { SourceAndLayers } from './SourceAndLayers'
import { roundPositionForURL } from './utils'
import {
  getStyleData,
  getThemeTopicData,
} from '@components/MapInterface/mapData'
import { createSourceTopicStyleLayerKey } from '../utils'

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
    // const style = event.target.getStyle()
    // const allLayer = style.layers
    // // @ts-ignore: 'AnyLayer' not relevant here
    // const basemapLayer = allLayer.filter((l) => l.source === 'openmaptiles')
    // console.log({ findBeforeIds: basemapLayer })
    setLoaded(true)
  }

  // Position the map when URL change is triggered from the outside (eg a Button that changes the URL-state to move the map)
  const { mainMap } = useMap()
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
  currentTheme.topics.forEach((topic) => {
    const topicData = getThemeTopicData(currentTheme, topic.id)
    if (!topicData) return
    topic.styles.map((style) => {
      const styleData = getStyleData(topicData, style.id)
      // @ts-ignore styleData should not be undefined here
      styleData.layers.forEach((layer) => {
        const layerKey = createSourceTopicStyleLayerKey(
          topicData.sourceId,
          topic.id,
          style.id,
          layer.id
        )
        interactiveLayerIds.push(layerKey)
      })
    })
  })

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
      // doubleClickZoom={false}
      dragRotate={false}
      touchZoomRotate={false}
    >
      <SourceAndLayers />
      <SourcesLayerRasterBackgrounds />
      <NavigationControl showCompass={false} />
      {/* <GeolocateControl /> */}
      {/* <ScaleControl /> */}
    </MapGl>
  )
}
