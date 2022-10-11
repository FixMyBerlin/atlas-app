import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import React from 'react'
import { Layer } from 'react-map-gl'
import { layerVisibility } from '../utils'

type Props = {
  sourceId: string
  sourceLayer: string | undefined
}

export const LayerHighlightParkingLanes: React.FC<Props> = ({
  sourceId,
  sourceLayer,
}) => {
  const { inspectorFeatures, calculatorFeatures } = useMapStateInteraction()

  const inspectorIds = inspectorFeatures?.map((o) => o?.properties?.id) || []
  const calculatorIds = calculatorFeatures?.map((o) => o?.properties?.id) || []

  console.log(sourceId, {
    inspectorIds,
    ivis: layerVisibility(!!inspectorIds?.length),
    calculatorIds,
    cvis: layerVisibility(!!calculatorIds?.length),
  })

  return (
    <>
      <Layer
        id={`${sourceId}_highlight_inspector`}
        type="line"
        source={`${sourceId}_highlight_inspector`}
        source-layer={sourceLayer}
        layout={layerVisibility(!!inspectorIds?.length)}
        filter={['in', 'id', ...inspectorIds]}
        paint={{ 'line-width': 10, 'line-color': 'rgba(146, 49, 154, 1)' }}
      />
      <Layer
        id={`${sourceId}_highlight_calculator`}
        type="line"
        source={`${sourceId}_highlight_calculator`}
        source-layer={sourceLayer}
        layout={layerVisibility(!!calculatorIds?.length)}
        filter={['in', 'id', ...calculatorIds]}
        paint={{ 'line-width': 10, 'line-color': '#500657' }}
      />
    </>
  )
}
