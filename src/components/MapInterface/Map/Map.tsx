import { useMatch, useNavigate, useSearch } from '@tanstack/react-location'
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
import { useStore } from 'zustand'
import { LocationGenerics } from '../../../routes'
import { useMapStateInteraction } from '../mapStateInteraction'
import { SourcesLayerRasterBackgrounds } from './backgrounds'
import { SourceAndLayers } from './SourceAndLayers'
import { roundByZoom, roundNumber } from './utils'
import {
  getStyleData,
  getThemeTopicData,
} from '@components/MapInterface/mapData'

// const GATSBY_MAPTILER_KEY = process.env.GATSBY_MAPTILER_KEY

export const Map: React.FC = () => {
  const {
    theme: _theme,
    lat,
    lng,
    zoom,
    bg: _selectedBackgroundId,
    config: _TODO_config,
  } = useSearch<LocationGenerics>()
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  const [cursorStyle, setCursorStyle] = useState('grab')

  const {
    setInspector,
    addToCalculator,
    removeFromCalculator,
    calculatorFeatures,
  } = useStore(useMapStateInteraction)

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  const handleLoad = (event: MapboxEvent) => {}

  // Position the map when URL change is triggered from the outside (eg a Button that changes the URL-state to move the map)
  const { mainMap } = useMap()
  useEffect(() => {
    const mapCenter = mainMap?.getCenter()
    const mapZoom = mainMap?.getZoom()
    if (!mapCenter || !mapZoom) {
      return
    }
    if (lat === mapCenter?.lat && lng === mapCenter?.lng && zoom === mapZoom) {
      return
    }
    mainMap?.flyTo({
      center: [lng || 0, lat || 0],
      zoom: zoom,
    })
  }, [lat, lng, zoom])

  const navigate = useNavigate<LocationGenerics>()
  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    navigate({
      search: (old) => {
        const zoom = event.viewState.zoom
        return {
          ...old,
          lat: roundByZoom(event.viewState.latitude, zoom),
          lng: roundByZoom(event.viewState.longitude, zoom),
          zoom: roundNumber(zoom, 1),
        }
      },
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
    const sourceId = topicData?.sourceId
    topic.styles.map((style) => {
      const styleData = getStyleData(topicData, style.id)
      // @ts-ignore styleData should not be undefined here
      styleData.layers.forEach((layer) => {
        const layerId = `${sourceId}--${topic.id}--${style.id}--${layer.id}`
        interactiveLayerIds.push(layerId)
      })
    })
  })

  return (
    <MapGl
      id="mainMap"
      initialViewState={{
        longitude: region?.map?.lng || 10,
        latitude: region?.map?.lat || 10,
        zoom: region?.map?.zoom || 10,
      }}
      // hash // we cannot use the hash prop because it interfiers with our URL based states; we recreate the same behavior manually
      style={{ width: '100%', height: '100%' }}
      mapLib={maplibregl}
      mapStyle="https://api.maptiler.com/maps/5cff051f-e5ca-43cf-b030-1f0286c59bb3/style.json?key=ECOoUBmpqklzSCASXxcu"
      interactiveLayerIds={interactiveLayerIds}
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
