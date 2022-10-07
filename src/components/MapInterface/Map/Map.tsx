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
import { StoreDebugBox, useStoreMap } from '../store'
import { SourcesLayerRasterBackgrounds } from './backgrounds'
import { SourceAndLayers } from './SourceAndLayers'
import { roundByZoom, roundNumber } from './utils'

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

  const zustandValues = useStore(useStoreMap)
  const {
    setInspector,
    addToCalculator,
    removeFromCalculator,
    calculatorFeatures,
    interactiveLayerIds,
    addInteractiveLayerIds,
  } = zustandValues

  const handleMouseEnter = (event: MapLayerMouseEvent) => {
    setCursorStyle('pointer')
    // handleInspect(event)
    event.features && setInspector(event.features)
  }
  const handleMouseLeave = (_event: MapLayerMouseEvent) => {
    setCursorStyle('grab')
  }
  const handleClick = (event: MapLayerMouseEvent) => {
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

  // TODO: We might not need this. We use it for debuggin only, ATM
  const handleLoad = (event: MapboxEvent) => {
    // Just for debugging
    const style = event.target.getStyle()
    const allLayer = style.layers
    // @ts-ignore: not relevant here
    const basemapLayer = allLayer.filter((l) => l.source === 'openmaptiles')
    // @ts-ignore: not relevant here
    const ourLayer = allLayer.filter((l) => l.source !== 'openmaptiles')
    const sources = style.sources

    addInteractiveLayerIds(ourLayer.map((l) => l.id)) // TODO this is just a temporary hack until we have a system to enable/disable layer on change.
    const mapCenter = mainMap?.getCenter()
    const mapZoom = mainMap?.getZoom()
    console.log('onLoad', {
      event,
      ourLayer,
      basemapLayer,
      sources,
      ...{ ...mapCenter, mapZoom },
    })
  }

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
  return (
    <MapGl
      id="mainMap"
      key={`mainMap-${interactiveLayerIds.join('')}`}
      initialViewState={{
        longitude: region?.map?.lng || 10,
        latitude: region?.map?.lat || 10,
        zoom: region?.map?.zoom || 10,
      }}
      // hash // we cannot use the hash prop because it interfiers with our URL based states; we recreate the same behavior manually
      style={{ width: '100%', height: '100%' }}
      mapLib={maplibregl}
      mapStyle="https://api.maptiler.com/maps/basic/style.json?key=ECOoUBmpqklzSCASXxcu"
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
    >
      <SourceAndLayers />
      <SourcesLayerRasterBackgrounds />
      <NavigationControl showCompass={false} />
      {/* <GeolocateControl /> */}
      {/* <ScaleControl /> */}

      <StoreDebugBox zustandValues={zustandValues} />
    </MapGl>
  )
}
