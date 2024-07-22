// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_lit: MapboxStyleLayer[] = [
  {
    layout: {
      'line-cap': 'round',
    },
    filter: ['match', ['get', 'lit'], ['special'], true, false],
    type: 'line',
    id: 'lit-special-line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 14, 5, 18, 12],
      'line-color': '#ffac38',
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0.8, 18, 0.6],
      'line-blur': 1,
    },
  },
  {
    layout: {
      'line-cap': 'round',
    },
    filter: ['match', ['get', 'lit'], ['no'], true, false],
    type: 'line',
    id: 'lit-no-line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 14, 5, 18, 12],
      'line-color': '#736e59',
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0.8, 18, 0.6],
      'line-blur': 2,
    },
  },
  {
    layout: {
      'line-cap': 'round',
    },
    filter: ['match', ['get', 'lit'], ['yes'], true, false],
    type: 'line',
    id: 'lit-yes-line',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 14, 5, 18, 12],
      'line-color': '#f8c52a',
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 13, 1, 18, 0.6],
      'line-blur': 3,
    },
  },
  {
    layout: {
      'line-cap': 'round',
    },
    filter: ['has', 'lit'],
    type: 'line',
    id: 'hitarea-lit',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 14.1, 10, 22, 12],
      'line-opacity': 0,
      'line-color': '#d814ff',
    },
  },
]