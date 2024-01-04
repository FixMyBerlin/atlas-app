// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_bikelanes_smooth_bad: MapboxStyleLayer[] = [
  {
    filter: ['has', 'surface'],
    type: 'line',
    id: 'smoothness-badonly',
    paint: {
      'line-color': [
        'match',
        ['get', 'smoothness'],
        ['bad'],
        '#f90606',
        ['very_bad'],
        '#d8035c',
        'rgba(0, 0, 0, 0)',
      ],
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 14, 2.5, 16, 3],
      'line-offset': 1,
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0, 8.1, 0.1, 8.5, 0.9],
      'line-dasharray': [1, 1],
    },
  },
]