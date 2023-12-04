import { wrapFilterWithAll } from '../../../_components/Map/SourcesAndLayers/utils/filterUtils/wrapFilterWithAll'
import { FileMapDataSubcategoryStyleLayer } from '../../types'

export const debugLayerStyles = ({
  source,
  sourceLayer,
  filter,
}: {
  source: string
  sourceLayer: string
  filter?: ['match', ['get', string], string[], boolean, boolean]
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
      filter: wrapFilterWithAll(filter),
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
      filter: wrapFilterWithAll(filter),
      layout: {},
    },
    {
      id: 'debugStyleLayerFill',
      type: 'fill',
      source: source,
      'source-layer': sourceLayer,
      paint: {
        'fill-color': '#a21caf',
        'fill-outline-color': '#701a75',
        'fill-opacity': 0.3,
      },
      filter: wrapFilterWithAll(filter),
      layout: {},
    },
  ] satisfies FileMapDataSubcategoryStyleLayer[]
}
