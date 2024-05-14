import { wrapFilterWithAll } from '../../../_components/Map/SourcesAndLayers/utils/filterUtils/wrapFilterWithAll'
import { FileMapDataSubcategoryStyleLayer } from '../../types'

export const debugLayerStyles = ({
  source,
  sourceLayer,
  filter,
}: {
  source: string
  sourceLayer: string
  filter?:
    | ['match', ['get', string], (string | number | boolean)[], boolean, boolean]
    | ['has', string]
}) => {
  const layers = [
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
      filter: wrapFilterWithAll(filter),
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
      filter: wrapFilterWithAll(filter),
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
      layout: {},
      filter: wrapFilterWithAll(filter),
    },
    {
      id: 'debugStyleLayerSymbol',
      type: 'symbol',
      source: source,
      'source-layer': sourceLayer,
      paint: {},
      layout: {
        'icon-image': 'rectangle-red-2',
        'icon-allow-overlap': true,
        'icon-size': 1,
      },
      filter: wrapFilterWithAll(filter),
    },
  ] satisfies FileMapDataSubcategoryStyleLayer[]
  // The `satisfies` will raise issues with the object inline which `as` would not.
  // However, the `as` is needed to make TS happy when using this layer in the context of a subcat
  return layers as FileMapDataSubcategoryStyleLayer[]
}
