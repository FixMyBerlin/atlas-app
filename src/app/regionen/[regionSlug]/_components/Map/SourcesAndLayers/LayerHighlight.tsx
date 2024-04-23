import React from 'react'
import { Layer, LayerProps } from 'react-map-gl/maplibre'
import { sources } from '../../../_mapData/mapDataSources/sources.const'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { extractHighlightFeatureIds } from './utils/extractHighlightFeatureIds'
import { useSelectedFeatures } from '../../../_hooks/useQueryState/useFeaturesParam/useSelectedFeatures'

type Props = {
  sourceData: (typeof sources)[number]
} & LayerProps

export const LayerHighlight = (parentLayerProps: Props) => {
  const { unfilteredInspectorFeatures, calculatorAreasWithFeatures, mapLoaded } =
    useMapStateInteraction()

  const selectedFeatures = useSelectedFeatures()
  const { sourceData } = parentLayerProps

  const features = unfilteredInspectorFeatures.length
    ? unfilteredInspectorFeatures
    : selectedFeatures.map((f) => f.mapFeature).filter(Boolean)

  if (!mapLoaded) return null

  let highlightingKey: string | undefined = undefined
  let featureIds: string[] | undefined = undefined

  if (sourceData.inspector.enabled) {
    highlightingKey = sourceData.inspector.highlightingKey
    featureIds = extractHighlightFeatureIds(
      features.filter((f) => f.layer.id === parentLayerProps.id),
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

  if (!highlightingKey || !featureIds || featureIds.length === 0) return null

  const props = {
    ...parentLayerProps,
    id: `${parentLayerProps.id}--highlight`,
    paint: structuredClone(parentLayerProps.paint),
  }

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

  return <Layer {...(props as LayerProps)} />
}
