// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_lit_complete: MapboxStyleLayer[] = [
  {
    filter: ['!', ['has', 'lit']],
    type: 'line',
    id: 'lit-missing',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 14, 1.5, 18, 3],
      'line-color': 'hsl(312, 92%, 74%)',
      'line-opacity': 0.7,
    },
  },
]