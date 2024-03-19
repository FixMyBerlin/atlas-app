// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_boundaries: MapboxStyleLayer[] = [
  {
    type: 'line',
    id: 'category_municipality_gemeinden',
    paint: {
      'line-color': '#efc6a9',
      'line-opacity': 0.6,
      'line-dasharray': [2.5, 1, 1, 1],
      'line-width': 1.5,
    },
    filter: ['has', 'category_municipality'],
  },
  {
    type: 'line',
    id: 'category_district_landkreis',
    paint: {
      'line-color': '#eab590',
      'line-width': 2,
      'line-opacity': 0.6,
      'line-dasharray': [2.5, 1, 1, 1],
    },
    filter: ['has', 'category_district'],
  },
]
