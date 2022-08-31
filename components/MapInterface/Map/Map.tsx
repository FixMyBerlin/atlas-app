import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useState } from 'react'
import {
  Map as MapGl,
  MapboxEvent,
  MapLayerMouseEvent,
  NavigationControl,
  ViewStateChangeEvent,
} from 'react-map-gl'
import { useStore } from 'zustand'
import { StoreDebugBox, useStoreMap } from '../store'
import {
  geschichteDefaultValues,
  GeschichteStore,
  useQuery,
} from '../store/geschichte'
import { SourcesLayerRasterBackgrounds } from './backgrounds'
import { SourceAndLayers } from './mapData/SourceAndLayers'

import { roundByZoom, roundNumber } from './utils'

// const GATSBY_MAPTILER_KEY = process.env.GATSBY_MAPTILER_KEY

export const Map: React.FC = () => {
  const [cursorStyle, setCursorStyle] = useState('grab')

  const { values, pushState } = useQuery()

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
  const handleLoad = (event: MapboxEvent) => {
    // Just for debugging
    const style = event.target.getStyle()
    const allLayer = style.layers
    // @ts-ignore
    const basemapLayer = allLayer.filter((l) => l.source === 'openmaptiles')
    // @ts-ignore
    const ourLayer = allLayer.filter((l) => l.source !== 'openmaptiles')
    const sources = style.sources

    addInteractiveLayerIds(ourLayer.map((l) => l.id)) // TODO this is just a temporary hack until we have a system to enable/disable layer on change.
    console.log('onLoad', { event, ourLayer, basemapLayer, sources })

    // Initial values from geschichte
    // TODO – This is not ideal. We start at the default location an fly to the URL location.
    //  Can/should we wait for the state to be present before initializing the map?
    const map = event.target
    map.flyTo({
      center: [values.map.lng, values.map.lat],
      zoom: values.map.zoom,
    })
  }

  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    pushState((state: GeschichteStore) => {
      const zoom = event.viewState.zoom
      state.map.zoom = roundNumber(zoom, 1)
      state.map.lat = roundByZoom(event.viewState.latitude, zoom)
      state.map.lng = roundByZoom(event.viewState.longitude, zoom)
    })
  }

  return (
    <MapGl
      id="mainMap"
      key={`mainMap-${interactiveLayerIds.join('')}`}
      initialViewState={{
        longitude: geschichteDefaultValues.map.lng,
        latitude: geschichteDefaultValues.map.lat,
        zoom: geschichteDefaultValues.map.zoom,
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

      <StoreDebugBox geschichteValues={values} zustandValues={zustandValues} />
    </MapGl>
  )
}
