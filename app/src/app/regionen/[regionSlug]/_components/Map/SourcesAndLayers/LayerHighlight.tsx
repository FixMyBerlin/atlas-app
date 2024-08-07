import { Layer, LayerProps } from 'react-map-gl/maplibre'
import { useMapLoaded } from '../../../_hooks/mapState/useMapState'

const statesToNumber = [
  '+',
  ['to-number', ['feature-state', 'hover']],
  ['*', ['to-number', ['feature-state', 'selected']], 2],
]

const HOVER = 1
const SELECTED = 2

const [opacityNone, colorNone] = [0, 'black']
const [opacitySelected, colorSelected] = [1, '#ff0000']
const [opacityHover, colorHover] = [0.5, '#ff9933']
const [opacityBoth, colorBoth] = [1, '#ff9933']

// prettier-ignore
const opacity = [
  'match',
  statesToNumber,
  HOVER, opacityHover,
  SELECTED, opacitySelected,
  HOVER | SELECTED, opacityBoth,
  opacityNone,
]

// prettier-ignore
const color = [
  'match',
  statesToNumber,
  HOVER, colorHover,
  SELECTED, colorSelected,
  HOVER | SELECTED, colorBoth,
  colorNone,
]

export const LayerHighlight = (props) => {
  const mapLoaded = useMapLoaded()
  if (!mapLoaded) return null

  const layerProps = {
    ...props,
    paint: structuredClone(props.paint),
  } as LayerProps

  if (layerProps.type === 'line') {
    if (!layerProps.paint) layerProps.paint = {}
    delete layerProps.paint['line-blur']
    layerProps.paint = {
      ...layerProps.paint,
      // @ts-ignore
      'line-color': color,
      // @ts-ignore
      'line-opacity': opacity,
      'line-width': layerProps.paint['line-width'],
    }
  } else if (layerProps.type === 'fill') {
    layerProps.paint = {
      ...layerProps.paint,
      // @ts-ignore
      'fill-color': color,
      // @ts-ignore
      'fill-opacity': opacity,
    }
  } else if (layerProps.type === 'circle') {
    layerProps.paint = {
      ...layerProps.paint,
      // @ts-ignore
      'circle-color': color,
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
      // @ts-ignore
      'text-halo-color': color,
      // @ts-ignore
      'text-opacity': opacity,
      'text-halo-width': 3,
    }
  }

  return <Layer {...layerProps} />
}
