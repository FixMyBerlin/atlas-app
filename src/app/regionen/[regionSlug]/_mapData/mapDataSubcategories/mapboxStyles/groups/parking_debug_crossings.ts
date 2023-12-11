// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_parking_debug_crossings: MapboxStyleLayer[] = [
  {
    layout: {},
    type: 'fill',
    id: 'buffer-pedestrian-crossings-area',
    paint: {
      'fill-color': 'rgba(33, 196, 93, 0.7)',
    },
  },
  {
    minzoom: 16.5,
    type: 'line',
    id: 'buffer-pedestrian-crossings-border',
    paint: {
      'line-color': 'rgb(0, 0, 0)',
      'line-dasharray': [2, 2],
      'line-opacity': 0.7,
    },
    layout: {},
  },
]
