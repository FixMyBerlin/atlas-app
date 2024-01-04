// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_boundaries: MapboxStyleLayer[] = [
  {
    type: 'line',
    id: 'admin-level-8-9-10',
    paint: {
      'line-color': 'hsl(323, 43%, 76%)',
      'line-opacity': 0.6,
      'line-dasharray': [2.5, 1, 1, 1],
      'line-width': 1.5,
    },
    filter: [
      'all',
      ['has', 'admin_level'],
      ['match', ['get', 'admin_level'], ['8', '9', '10'], true, false],
    ],
  },
  {
    type: 'line',
    id: 'admin-level-7',
    paint: {
      'line-color': 'hsl(323, 43%, 76%)',
      'line-width': 2,
      'line-opacity': 0.6,
      'line-dasharray': [2.5, 1, 1, 1],
    },
    filter: ['all', ['has', 'admin_level'], ['match', ['get', 'admin_level'], ['7'], true, false]],
  },
]
