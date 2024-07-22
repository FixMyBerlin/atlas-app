// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_parking_stats_length: MapboxStyleLayer[] = [
  {
    filter: ['has', 'lane_km'],
    type: 'fill',
    id: 'area-0-to-100 copy',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['to-number', ['get', 'lane_km']],
        0,
        'rgb(163, 255, 189)',
        200,
        'rgb(0, 128, 36)',
      ],
      'fill-outline-color': 'hsl(0, 100%, 100%)',
      'fill-opacity': 0.35,
    },
  },
  {
    type: 'line',
    id: 'line copy',
    paint: {
      'line-color': 'hsl(0, 0%, 100%)',
      'line-opacity': 0.63,
    },
    filter: ['has', 'lane_km'],
  },
  {
    layout: {
      'text-field': ['to-string', ['get', 'lane_km']],
    },
    filter: ['has', 'lane_km'],
    type: 'symbol',
    id: 'label copy',
    paint: {
      'text-color': 'rgba(0, 51, 37, 0.95)',
      'text-halo-width': 1,
      'text-halo-color': 'hsl(291, 0%, 100%)',
      'text-halo-blur': 1,
    },
  },
]