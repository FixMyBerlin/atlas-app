// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_parking_parkinglines: MapboxStyleLayer[] = [
  {
    id: 'street parking lines',
    type: 'line',
    paint: {
      'line-color': 'rgb(22, 163, 74)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 20, 16],
      'line-opacity': ['match', ['get', 'operator_type'], ['private'], 0.33, 1],
    },
    filter: ['has', 'capacity'],
  },
  {
    id: 'parallel pattern',
    type: 'line',
    paint: {
      'line-color': 'rgb(237, 237, 237)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 16, 0.7, 20, 5],
      'line-dasharray': [4, 2],
      'line-opacity': 0.67,
    },
    filter: [
      'all',
      ['match', ['get', 'orientation'], ['parallel'], true, false],
      ['has', 'capacity'],
    ],
  },
  {
    minzoom: 16,
    filter: [
      'all',
      ['match', ['get', 'orientation'], ['diagonal'], true, false],
      ['has', 'capacity'],
    ],
    type: 'line',
    id: 'diagonal pattern',
    paint: {
      'line-color': 'rgb(237, 237, 237)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 20, 16],
      'line-opacity': 0.67,
      'line-pattern': 'parking_diagonal',
    },
  },
  {
    minzoom: 16,
    filter: [
      'all',
      ['match', ['get', 'orientation'], ['perpendicular'], true, false],
      ['has', 'capacity'],
    ],
    type: 'line',
    id: 'perpendicular pattern',
    paint: {
      'line-color': 'rgb(237, 237, 237)',
      'line-pattern': 'parking_perpendicular',
      'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 20, 16],
      'line-opacity': 0.67,
    },
  },
]