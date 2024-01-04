// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_parking_debug_bus_tram: MapboxStyleLayer[] = [
  {
    type: 'fill',
    id: 'parking-bus-tram-area',
    paint: {
      'fill-color': 'rgba(250, 204, 20, 0.7)',
    },
    minzoom: 15,
  },
  {
    minzoom: 16.5,
    type: 'line',
    id: 'parking-bus-tram-line',
    paint: {
      'line-dasharray': [2, 2],
      'line-color': 'rgb(0, 0, 0)',
    },
  },
  {
    minzoom: 15,
    layout: {
      'icon-image': 'bus_stop',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 15, 0, 22, 1.5],
    },
    type: 'symbol',
    id: 'parking-bus-tram-icon',
    paint: {},
  },
]
