import { MapData } from '@components/MapInterface/mapData'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import React from 'react'
import { Layer, LayerProps } from 'react-map-gl'
import { extractHighlightFeatureIds } from './utils/extractHighlightFeatureIds'

type Props = {
  id: string
  paint: any
  layout: object
  source: string
  filter: undefined | object
  type: string
  'source-layer': undefined | string
  sourceData: MapData['sources'][number]
}

export const LayerHighlight: React.FC<Props> = (parentLayerProps) => {
  const { inspectorFeatures, calculatorAreasWithFeatures, mapLoaded } = useMapStateInteraction()
  const { sourceData } = parentLayerProps

  if (!mapLoaded) return null

  let highlightingKey: string | undefined = undefined
  let featureIds: string[] | undefined = undefined

  if (sourceData.inspector.enabled) {
    highlightingKey = sourceData.inspector.highlightingKey
    featureIds = extractHighlightFeatureIds(
      inspectorFeatures.filter((f) => f.layer.id === parentLayerProps.id),
      highlightingKey,
    )
  }
  if (sourceData.calculator.enabled) {
    highlightingKey = sourceData.calculator.highlightingKey
    featureIds = extractHighlightFeatureIds(
      calculatorAreasWithFeatures.map((e) => e.features).flat(),
      highlightingKey,
    )
  }

  if (!highlightingKey || !featureIds) return null

  const props = {
    ...parentLayerProps,
    id: parentLayerProps.id + '--highlight',
    paint: structuredClone(parentLayerProps.paint),
  } as LayerProps

  if (props.type === 'line') {
    if (!props.paint) props.paint = {}
    props.paint['line-color'] = 'red'
    delete props.paint['line-blur']
    delete props.paint['line-opacity']
  } else if (props.type === 'fill') {
    props.paint = {
      ...props.paint,
      'fill-color': 'red',
      'fill-opacity': 0.8,
    }
  } else if (props.type === 'circle') {
    props.paint = {
      ...props.paint,
      'circle-color': 'red',
      'circle-stroke-color': 'black',
      'circle-stroke-width': 2,
    }
  } else if (props.type === 'symbol') {
    props.paint = {
      ...props.paint,
      'text-halo-color': 'red',
      'text-halo-width': 3,
    }
  }

  if ('filter' in props) {
    props.filter = ['in', highlightingKey, ...featureIds]
  }

  return <Layer {...props} />
}
