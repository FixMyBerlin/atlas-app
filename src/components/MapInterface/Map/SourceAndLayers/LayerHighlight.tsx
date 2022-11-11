import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import React from 'react'
import { Layer } from 'react-map-gl'

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

  if (!inspectorFeatures) return null

  const osmIds = inspectorFeatures
    .filter((f) => f?.properties)
    .filter((f) => f.layer.id === parentLayerProps.id)
    // @ts-ignore f.properties can't be null here
    .map((f) => f.properties.osm_id)

  if (!osmIds.length) return null

  const props = {
    ...parentLayerProps,
    id: parentLayerProps.id + '--highlight',
    paint: JSON.parse(JSON.stringify(parentLayerProps.paint)),
  }

  if (props.type === 'line') {
    if (!props.paint) props.paint = {}
    props.paint['line-color'] = 'red'
    delete props.paint['line-blur']
    delete props.paint['line-opacity']
  } else if (props.type === 'fill') {
    props.paint['fill-color'] = 'red'
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

  props.filter = ['in', 'osm_id', ...osmIds]

  return (
    <>
      {/* @ts-ignore TODO: find out what's wrong here */}
      <Layer {...props} />
    </>
  )
}
