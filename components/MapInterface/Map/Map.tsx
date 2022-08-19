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
import {
  geschichteDefaultValues,
  GeschichteStore,
  useQuery,
} from '../store/geschichte'
import { useStoreMap } from '../store/useStoreMap'
import { SourcesLayerRasterBackgrounds } from './backgrounds'
import { SourcesBoundaries } from './boundaries'
import { SourcesParkingLanes } from './parkingLanes'
import { SourcesTarmacGeoHighways, SourcesTarmacGeoPois } from './tarmac-geo'
import { SourcesUnfallatlas } from './unfallatlas'
import { roundByZoom, roundNumber } from './utils'

// const GATSBY_MAPTILER_KEY = process.env.GATSBY_MAPTILER_KEY

export const Map: React.FC = () => {
  const interactiveLayerIds = ['vts_pl', 'vts_pl_no', 'vts_pl_all_other']

  const { values, pushState } = useQuery()

  const [cursorStyle, setCursorStyle] = useState('grab')
  const {
    setInspector,
    addToCalculator,
    removeFromCalculator,
    calculatorFeatures,
  } = useStore(useStoreMap)

  const handleMouseEnter = (event: MapLayerMouseEvent) => {
    setCursorStyle('pointer')
    // handleInspect(event)
    event.features && setInspector(event.features)
  }
  const handleMouseLeave = (_event: MapLayerMouseEvent) => {
    setCursorStyle('grab')
  }
  const handleClick = (event: MapLayerMouseEvent) => {
    const features = event.features
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
      initialViewState={{
        longitude: geschichteDefaultValues.map.lng,
        latitude: geschichteDefaultValues.map.lat,
        zoom: geschichteDefaultValues.map.zoom,
      }}
      // hash
      style={{ width: '100%', height: 800 }}
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
      <SourcesParkingLanes />
      <SourcesBoundaries />
      <SourcesUnfallatlas />
      <SourcesLayerRasterBackgrounds />
      <SourcesTarmacGeoHighways />
      <SourcesTarmacGeoPois />
      <NavigationControl showCompass={false} />
      {/* <GeolocateControl /> */}
      {/* <ScaleControl /> */}
      {/* Gebugging Geschichte */}
      <div className="z-50 absolute top-5 left-5 text-[10px] font-mono bg-pink-300 rounded px-3">
        {JSON.stringify(values)}
      </div>
    </MapGl>
  )
}
