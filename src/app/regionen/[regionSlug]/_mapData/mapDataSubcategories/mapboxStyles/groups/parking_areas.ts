// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_parking_areas: MapboxStyleLayer[] = [
  {
    type: 'fill',
    id: 'background colour',
    paint: {
      'fill-color': [
        'case',
        ['match', ['get', 'parking'], ['multi-storey'], true, false],
        'rgb(233, 91, 84)',
        ['match', ['get', 'parking'], ['underground'], true, false],
        'rgb(142, 192, 169)',
        ['match', ['get', 'parking'], ['carports', 'carport'], true, false],
        'rgb(251, 206, 74)',
        ['match', ['get', 'building'], ['garages', 'garage', 'carport'], true, false],
        'rgb(251, 206, 74)',
        'rgb(48, 159, 219)',
      ],
    },
  },
  {
    type: 'fill',
    id: 'stripe pattern',
    paint: {
      'fill-color': 'rgba(0, 0, 0, 0)',
      'fill-pattern': ['match', ['get', 'access'], ['customers', 'private'], 'stripe_texture', ''],
      'fill-opacity': 0.5,
    },
  },
  {
    layout: {
      'text-field': ['to-string', ['get', 'capacity']],
      'text-size': ['interpolate', ['linear'], ['zoom'], 14.99, 0, 15, 9, 20, 20],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Regular'],
    },
    type: 'symbol',
    id: 'capacity label',
    paint: {
      'text-color': 'rgb(255, 255, 255)',
      'text-halo-width': 0.5,
      'text-halo-color': 'rgba(0, 0, 0, 0.33)',
    },
  },
]
