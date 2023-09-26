import { LocationGenerics } from 'src/TODO-MIRGRATE-REMOVE/routes'
import { useSearch } from '@tanstack/react-location'
import bbox from '@turf/bbox'
import booleanIntersects from '@turf/boolean-intersects'
import React, { useEffect } from 'react'
import { useMap } from 'react-map-gl'
import { MapDataSourceCalculator } from '../../mapData'
import { StoreCalculator, useMapStateInteraction } from '../../mapStateInteraction'
import {
  CalculatorControlsDrawControl,
  DrawArea,
  DrawControlProps,
} from './CalculatorControlsDrawControl'
import { useDelete } from './hooks/useDelete'
import { useUpdate } from './hooks/useUpdate'

type Props = {
  queryLayers: MapDataSourceCalculator['queryLayers']
  drawControlRef: DrawControlProps['ref']
}

export const CalculatorControls: React.FC<Props> = ({ queryLayers, drawControlRef }) => {
  const { mainMap } = useMap()

  const { draw: drawAreasStore } = useSearch<LocationGenerics>()
  const { mapLoaded, setCalculatorAreasWithFeatures } = useMapStateInteraction()

  // We store the Calculator Shapes as URL State `draw`
  // and read from there to do the calculation
  useEffect(() => {
    if (!mainMap || !mapLoaded || !drawAreasStore) return

    const result: StoreCalculator['calculatorAreasWithFeatures'] = []

    drawAreasStore.forEach((selectArea) => {
      const polygonBbox = bbox(selectArea)
      const southWest: mapboxgl.LngLatLike = [polygonBbox[0], polygonBbox[1]]
      const northEast: mapboxgl.LngLatLike = [polygonBbox[2], polygonBbox[3]]
      const northEastPointPixel = mainMap.project(northEast)
      const southWestPointPixel = mainMap.project(southWest)

      const features = mainMap.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
        layers: queryLayers,
      })

      const filteredFeatures = features
        .map((feature) => {
          if (booleanIntersects(feature, selectArea)) {
            return feature
          }
        })
        .filter((feature): feature is mapboxgl.MapboxGeoJSONFeature => !!feature)

      result.push({
        key: selectArea.id,
        features: filteredFeatures,
      })
    })

    setCalculatorAreasWithFeatures(result)
  }, [drawAreasStore, mapLoaded])

  // Update the URL, extracted as hook
  const { updateDrawFeatures } = useUpdate()
  const onUpdate = (e: { features: DrawArea[] }) => {
    updateDrawFeatures(drawAreasStore, e.features)
  }

  // Update the URL, extracted as hook
  const { deleteDrawFeatures } = useDelete()
  const onDelete = (e: { features: DrawArea[] }) => {
    deleteDrawFeatures(drawAreasStore, e.features)
  }

  // OnInit, add drawAreas from store to the UI
  useEffect(() => {
    if (!mapLoaded || !drawAreasStore) return

    drawAreasStore.forEach((feature) => {
      return drawControlRef.current?.add(feature)
    })
    updateDrawFeatures(drawAreasStore, drawAreasStore)
  }, [mapLoaded])

  return (
    <CalculatorControlsDrawControl
      ref={drawControlRef}
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
  )
}
