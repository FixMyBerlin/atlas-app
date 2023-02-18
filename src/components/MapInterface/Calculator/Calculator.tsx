import React, { useEffect, useState } from 'react'
import { useMap } from 'react-map-gl'
import { DrawArea, DrawControl } from '../Map/DrawControl'
import { StoreCalculator, useMapStateInteraction } from '../mapStateInteraction'
import { CalculatorOutput } from './CalculatorOutput'
import bbox from '@turf/bbox'
import booleanIntersects from '@turf/boolean-intersects'

export const Calculator: React.FC = () => {
  const { mainMap } = useMap()

  const [calculatorDrawAreas, setCalculatorDrawAreas] = useState<DrawArea[]>([])
  const { setCalculatorAreasWithFeatures } = useMapStateInteraction()
  const drawRef = React.useRef<MapboxDraw>() // TODO

  useEffect(() => {
    if (!mainMap) return

    const calculatorAreasWithFeatures: StoreCalculator['calculatorAreasWithFeatures'] =
      []

    calculatorDrawAreas.forEach((selectArea) => {
      const polygonBbox = bbox(selectArea)
      const southWest: mapboxgl.LngLatLike = [polygonBbox[0], polygonBbox[1]]
      const northEast: mapboxgl.LngLatLike = [polygonBbox[2], polygonBbox[3]]
      const northEastPointPixel = mainMap.project(northEast)
      const southWestPointPixel = mainMap.project(southWest)

      const features = mainMap.queryRenderedFeatures(
        [southWestPointPixel, northEastPointPixel],
        {
          layers: [
            // TODO move to config
            'parkraumParkingPoints--parkingPoints--default--parkraumParkingPointsLayer',
          ],
        }
      )

      const filteredFeatures = features
        .map((feature) => {
          if (booleanIntersects(feature, selectArea)) {
            return feature
          }
        })
        .filter(
          (feature): feature is mapboxgl.MapboxGeoJSONFeature => !!feature
        )

      calculatorAreasWithFeatures.push({
        key: selectArea.id,
        features: filteredFeatures,
      })
    })

    setCalculatorAreasWithFeatures(calculatorAreasWithFeatures)
  }, [calculatorDrawAreas])

  const onUpdate = (e: { features: DrawArea[] }) => {
    // Input can be added, modified or multi select modification
    const inputFeatures = e.features
    setCalculatorDrawAreas((currFeatures) => {
      // Case new feature(s):
      const currFeatureIds = currFeatures.map((f) => f.id)
      const newFeatures = inputFeatures.filter(
        (iF) => !currFeatureIds.includes(iF.id)
      )
      // Case modified features
      const modifiedFeatures = inputFeatures.filter((iF) =>
        currFeatureIds.includes(iF.id)
      )
      // Rest: Non modified features
      const modifiedFeatureIds = modifiedFeatures.map((f) => f.id)
      const untouchedFeatures = currFeatures.filter(
        (cF) => !modifiedFeatureIds.includes(cF.id)
      )
      return [...newFeatures, ...modifiedFeatures, ...untouchedFeatures]
    })
  }

  const onDelete = (e: { features: DrawArea[] }) => {
    const inputFeatures = e.features
    setCalculatorDrawAreas((currFeatures) => {
      const deletedFeaturesIds = inputFeatures.map((f) => f.id)
      return currFeatures.filter(
        (feature) => !deletedFeaturesIds.includes(feature.id)
      )
    })
  }

  return (
    <>
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
      <CalculatorOutput />
    </>
  )
}
