// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_bikelane_presence: MapboxStyleLayer[] = [
  {
    filter: ['has', 'bikelane_right'],
    type: 'line',
    id: 'bikelane_right',
    paint: {
      'line-color': [
        'case',
        ['match', ['get', 'bikelane_right'], ['missing'], true, false],
        '#fa80f4',
        ['match', ['get', 'bikelane_right'], ['not_expected'], true, false],
        'rgba(218, 226, 223, 0.68)',
        ['match', ['get', 'bikelane_right'], ['data_no'], true, false],
        'rgba(192, 202, 185, 0.67)',
        ['has', 'bikelane_right'],
        'rgba(174, 199, 244, 0.7)',
        'rgba(0, 0, 0, 0.7)',
      ],
      'line-offset': ['step', ['zoom'], 2, 14, 4],
      'line-width': ['match', ['get', 'bikelane_right'], ['missing', 'data_no'], 3, 1],
    },
  },
  {
    filter: ['has', 'bikelane_self'],
    type: 'line',
    id: 'bikelane_self',
    paint: {
      'line-color': [
        'case',
        ['match', ['get', 'bikelane_self'], ['missing'], true, false],
        '#fa80f4',
        ['match', ['get', 'bikelane_self'], ['not_expected'], true, false],
        'rgba(218, 226, 223, 0.68)',
        ['match', ['get', 'bikelane_self'], ['data_no'], true, false],
        'rgba(192, 202, 185, 0.67)',
        ['has', 'bikelane_self'],
        'rgba(174, 199, 244, 0.7)',
        'rgba(0, 0, 0, 0.7)',
      ],
      'line-width': ['match', ['get', 'bikelane_self'], ['missing', 'data_no'], 3, 1],
    },
  },
  {
    filter: ['has', 'bikelane_left'],
    type: 'line',
    id: 'bikelane_left',
    paint: {
      'line-color': [
        'case',
        ['match', ['get', 'bikelane_left'], ['missing'], true, false],
        '#fa80f4',
        ['match', ['get', 'bikelane_left'], ['not_expected'], true, false],
        'rgba(218, 226, 223, 0.68)',
        ['match', ['get', 'bikelane_left'], ['data_no'], true, false],
        'rgba(192, 202, 185, 0.67)',
        ['has', 'bikelane_left'],
        'rgba(174, 199, 244, 0.7)',
        'rgba(0, 0, 0, 0.7)',
      ],
      'line-offset': ['step', ['zoom'], -2, 14, -4],
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        7,
        ['match', ['get', 'bikelane_left'], ['missing', 'data_no'], 1, 0.5],
        16,
        ['match', ['get', 'bikelane_left'], ['missing', 'data_no'], 8, 4],
      ],
    },
  },
]
