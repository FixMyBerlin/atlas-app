import { Layer, LayerProps } from 'react-map-gl/maplibre'
import { useMapLoaded } from '../../../_hooks/mapState/useMapState'

export const LayerHighlight = (props) => {
  const mapLoaded = useMapLoaded()
  if (!mapLoaded) return null

  const layerProps = {
    ...props,
    paint: structuredClone(props.paint),
  } as LayerProps

  const opacity = ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0]

  if (layerProps.type === 'line') {
    if (!layerProps.paint) layerProps.paint = {}
    delete layerProps.paint['line-blur']
    layerProps.paint = {
      ...layerProps.paint,
      'line-color': 'red',
      // @ts-ignore
      'line-opacity': opacity,
      'line-width': layerProps.paint['line-width'],
    }
  } else if (layerProps.type === 'fill') {
    layerProps.paint = {
      ...layerProps.paint,
      'fill-color': 'red',
      // @ts-ignore
      'fill-opacity': opacity,
    }
  } else if (layerProps.type === 'circle') {
    layerProps.paint = {
      ...layerProps.paint,
      'circle-color': 'red',
      // @ts-ignore
      'circle-opacity': opacity,
      // @ts-ignore
      'circle-stroke-opacity': opacity,
      'circle-stroke-color': 'black',
      'circle-stroke-width': 2,
    }
  } else if (layerProps.type === 'symbol') {
    layerProps.paint = {
      ...layerProps.paint,
      'text-halo-color': 'red',
      // @ts-ignore
      'text-opacity': opacity,
      'text-halo-width': 3,
    }
  }

  return <Layer {...layerProps} />
}
