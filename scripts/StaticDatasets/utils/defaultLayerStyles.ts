import { wrapFilterWithAll } from './wrapFilterWithAll'
import { FileMapDataSubcategoryStyleLayer } from 'src/app/regionen/[regionSlug]/_mapData/types'

// Tries to extract styles form the data and falls back to defaults.
// 1. Tries to use felt.com styles (not documented)
//    - "felt:color:"#000"
//    - "felt:fillOpacity":0.72
//    - "felt:strokeStyle":"dashed"
//    - "felt:strokeStyle":"dotted"
//    - "felt:strokeOpacity":0.41
//    - "felt:strokeWidth":6
// 2. Tries to use the simplestyle specification
//    - https://www.placemark.io/documentation/simplestyle
//    - https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
// Docs: Color values can be keywords, hex, rgb(a), hsl(a)
//    - https://github.com/maplibre/maplibre-style-spec/blob/main/src/util/color.ts#L61
//    - https://github.com/maplibre/maplibre-style-spec/blob/main/src/util/parse_css_color.ts#L32

export const defaultLineLayerStyles = ({
  filter,
}: {
  filter?: ['match', ['get', string], string[], boolean, boolean]
}) => {
  return [
    {
      id: 'datasetsDefaultLayerLine',
      type: 'line',
      paint: {
        'line-width': ['coalesce', ['get', 'felt:strokeWidth'], ['get', 'stroke-width'], 10],
        'line-color': ['to-color', ['get', 'felt:color'], ['get', 'stroke'], '#14b8a6'],
        'line-opacity': ['coalesce', ['get', 'felt:strokeOpacity'], ['get', 'stroke-opacity'], 0.6],
        // This does not work, yet. Workaround is below.
        // https://maplibre.org/maplibre-style-spec/layers/#paint-line-line-dasharray
        // https://github.com/maplibre/maplibre-gl-js/issues/1235
        // 'line-dasharray': [
        //   'case',
        //   ['all', ['==', ['get', 'felt:strokeStyle'], 'dashed']],
        //   ['literal', [1, 2]],
        //   ['all', ['==', ['get', 'felt:strokeStyle'], 'dotted']],
        //   ['literal', [0.1, 1.5]],
        //   ['literal', [1, 1]],
        // ],
      },
      filter: wrapFilterWithAll(filter),
      layout: {},
    },
    // Those two layers are a workaround to add the right line-dasharray
    // Thank to https://github.com/maplibre/maplibre-gl-js/issues/1235#issuecomment-1358000968
    {
      id: 'datasetsDefaultLayerLine--felt-dashed',
      type: 'line',
      paint: {
        'line-width': ['coalesce', ['get', 'felt:strokeWidth'], ['get', 'stroke-width'], 10],
        'line-color': ['to-color', ['get', 'felt:color'], ['get', 'stroke'], '#14b8a6'],
        'line-opacity': ['coalesce', ['get', 'felt:strokeOpacity'], ['get', 'stroke-opacity'], 0.6],
        'line-dasharray': [1, 2],
      },
      // Reminder: `filter` is a `match` expression which is not allowed to be the first item in [`all`].
      filter: wrapFilterWithAll([
        ['==', ['get', 'felt:strokeStyle'], 'dashed'],
        ...(filter ? [filter] : []),
      ]),
      layout: {},
    },
    {
      id: 'datasetsDefaultLayerLine--felt-dotted',
      type: 'line',
      paint: {
        'line-width': ['coalesce', ['get', 'felt:strokeWidth'], ['get', 'stroke-width'], 10],
        'line-color': ['to-color', ['get', 'felt:color'], ['get', 'stroke'], '#14b8a6'],
        'line-opacity': ['coalesce', ['get', 'felt:strokeOpacity'], ['get', 'stroke-opacity'], 0.6],
        'line-dasharray': [0.1, 1.5],
      },
      filter: wrapFilterWithAll([
        ['==', ['get', 'felt:strokeStyle'], 'dotted'],
        ...(filter ? [filter] : []),
      ]),
      layout: {},
    },
  ] satisfies Omit<FileMapDataSubcategoryStyleLayer, 'source' | 'source-layer'>[]
}

export const defaultPointLayerStyles = ({
  filter,
}: {
  filter?: ['match', ['get', string], string[], boolean, boolean]
}) => {
  return [
    {
      id: 'datasetsDefaultLayerCircle',
      type: 'circle',
      paint: {
        'circle-radius': ['coalesce', ['get', 'felt:strokeWidth'], ['get', 'stroke-width'], 5],
        'circle-color': ['to-color', ['get', 'felt:color'], ['get', 'stroke'], '#0f766e'],
        'circle-opacity': [
          'coalesce',
          ['get', 'felt:strokeOpacity'],
          ['get', 'stroke-opacity'],
          0.6,
        ],
      },
      filter: wrapFilterWithAll(filter),
    },
  ] satisfies Omit<FileMapDataSubcategoryStyleLayer, 'source' | 'source-layer'>[]
}

export const defaultAreaLayerStyles = ({
  filter,
}: {
  filter?: ['match', ['get', string], string[], boolean, boolean]
}) => {
  return [
    {
      id: 'datasetsDefaultLayerFill',
      type: 'fill',
      paint: {
        'fill-color': ['to-color', ['get', 'felt:color'], ['get', 'fill'], '#14b8a6'],
        'fill-outline-color': ['to-color', ['get', 'felt:color'], ['get', 'stroke'], '#0f766e'],
        'fill-opacity': ['coalesce', ['get', 'felt:fillOpacity'], ['get', 'fill-opacity'], 0.3],
      },
      filter: wrapFilterWithAll(filter),
      layout: {},
    },
  ] satisfies Omit<FileMapDataSubcategoryStyleLayer, 'source' | 'source-layer'>[]
}
