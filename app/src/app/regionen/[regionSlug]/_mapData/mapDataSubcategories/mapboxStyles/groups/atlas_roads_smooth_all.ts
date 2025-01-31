// DO NOT EDIT MANUALLY
// This file was automatically generated by `scripts/MapboxStyles/process.ts`

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_roads_smooth_all: MapboxStyleLayer[] = [
  {
    filter: ['has', 'smoothness'],
    type: 'line',
    id: 'smoothness-roads-all',
    paint: {
      'line-color': [
        'match',
        ['get', 'smoothness'],
        ['bad'],
        '#f90606',
        ['very_bad'],
        '#d8035c',
        ['intermediate'],
        '#faa00f',
        ['good'],
        '#b5ea2e',
        ['excellent'],
        '#37f644',
        '#000000',
      ],
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 14, 3, 16, 5],
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 9.9, 0, 10, 0.1, 10.3, 0.9],
    },
  },
]
