import { MapDataVisLayer } from '../../types'

export const debugLayerStyles = ({
  source,
  sourceLayer,
}: {
  source: string
  sourceLayer: string
}) => {
  return [
    {
      id: 'debugStyleLayerLine',
      type: 'line',
      source: source,
      'source-layer': sourceLayer,
      paint: {
        'line-width': 10,
        'line-color': '#a21caf',
        'line-opacity': 0.6,
      },
      layout: {},
    },
    {
      id: 'debugStyleLayerCircle',
      type: 'circle',
      source: source,
      'source-layer': sourceLayer,
      paint: {
        'circle-radius': 5,
        'circle-opacity': 0.6,
        'circle-color': '#701a75',
      },
      layout: {},
    },
    {
      id: 'debugStyleLayerLine',
      type: 'fill',
      source: source,
      'source-layer': sourceLayer,
      paint: {
        'fill-color': '#a21caf',
        'fill-outline-color': '#701a75',
        'fill-opacity': 0.3,
      },
      layout: {},
    },
  ] satisfies MapDataVisLayer[]
}
