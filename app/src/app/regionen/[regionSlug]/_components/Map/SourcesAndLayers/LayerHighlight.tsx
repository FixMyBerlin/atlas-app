import { Layer, LayerProps } from 'react-map-gl/maplibre'
import { useMapLoaded } from '../../../_hooks/mapState/useMapState'

function createMatchExpression<T extends string | number>(
  valueNone: T,
  valueHover: T,
  valueSelected: T,
  valueHoverSelected: T,
) {
  // prettier-ignore
  return [
    'match',
    [
      '+',
      ['to-number', ['feature-state', 'hover']],
      ['*', ['to-number', ['feature-state', 'selected']], 2],
    ],
    0, valueNone,
    1, valueHover,
    2, valueSelected,
    3, valueHoverSelected,
    valueNone,
  ]
}

const opacity = createMatchExpression(0, 0.5, 1, 1)
const color = createMatchExpression('black', '#ff9933', '#ff0000', '#ff9933')

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

  // HOTFIX: https://github.com/FixMyBerlin/private-issues/issues/1955#issuecomment-2326722336
  return null //<Layer {...layerProps} />
}
