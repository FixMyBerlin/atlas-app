import bbox from '@turf/bbox'
import booleanIntersects from '@turf/boolean-intersects'
import { useEffect } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { useDrawParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDrawParam'
import {
  StoreCalculator,
  useMapStateInteraction,
} from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { MapDataSourceCalculator } from '../../../_mapData/types'
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

export const CalculatorControls = ({ queryLayers, drawControlRef }: Props) => {
  const { mainMap } = useMap()
  const { drawParam } = useDrawParam()
  const { mapLoaded, setCalculatorAreasWithFeatures } = useMapStateInteraction()

  // We store the Calculator Shapes as URL State `draw`
  // and read from there to do the calculation
  useEffect(() => {
    if (!mainMap || !mapLoaded || !drawParam) return

    const result: StoreCalculator['calculatorAreasWithFeatures'] = []

    drawParam.forEach((selectArea) => {
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
        .filter(Boolean)

      result.push({
        key: selectArea.id,
        features: filteredFeatures,
      })
    })

    setCalculatorAreasWithFeatures(result)
  }, [drawParam, mainMap, mapLoaded, queryLayers, setCalculatorAreasWithFeatures])

  // Update the URL, extracted as hook
  const { updateDrawFeatures } = useUpdate()
  const onUpdate = (e: { features: DrawArea[] }) => {
    updateDrawFeatures(drawParam, e.features)
  }

  // Update the URL, extracted as hook
  const { deleteDrawFeatures } = useDelete()
  const onDelete = (e: { features: DrawArea[] }) => {
    deleteDrawFeatures(drawParam, e.features)
  }

  // OnInit, add drawAreas from store to the UI
  useEffect(() => {
    if (!mapLoaded || !drawParam || !drawParam.length) return

    drawParam.forEach((feature) => {
      return drawControlRef.current?.add(feature)
    })
  }, [drawControlRef, drawParam, mapLoaded])

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
