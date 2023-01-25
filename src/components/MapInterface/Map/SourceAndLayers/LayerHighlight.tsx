import { getSourceData } from '@components/MapInterface/mapData'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import React from 'react'
import { Layer, LayerProps } from 'react-map-gl'
import { extractSourceIdIdFromSourceKey } from './utils/extractFromSourceKey'

type Props = {
  id: string
  paint: any
  layout: object
  source: string
  filter: undefined | object
  type: string
  'source-layer': undefined | string
}

export const LayerHighlight: React.FC<Props> = (parentLayerProps) => {
  const { inspectorFeatures } = useMapStateInteraction()
  const sourceData = getSourceData(
    extractSourceIdIdFromSourceKey(parentLayerProps.source)
  )

  if (!inspectorFeatures || !sourceData.inspector.enabled) return null

  const highlightingKey = sourceData.inspector.highlightingKey
  const osmIds = inspectorFeatures
    .filter((f) => f.layer.id === parentLayerProps.id)
    .map((f) => f?.properties?.[highlightingKey])
    .filter((id): id is string => !!id)

  if (!osmIds.length) return null

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
    props?.paint && (props.paint['fill-color'] = 'red')
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
    props.filter = ['in', highlightingKey, ...osmIds]
  }

  return <Layer {...props} />
}
