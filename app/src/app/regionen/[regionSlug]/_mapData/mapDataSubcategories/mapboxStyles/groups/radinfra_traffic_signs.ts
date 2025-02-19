// DO NOT EDIT MANUALLY
// This file was automatically generated by `scripts/MapboxStyles/process.ts`

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_radinfra_traffic_signs: MapboxStyleLayer[] = [
  {
    maxzoom: 13,
    filter: ['!', ['has', 'traffic_sign']],
    type: 'heatmap',
    id: 'sign-heatmap',
    paint: {
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0, 0, 255, 0)',
        1,
        '#fda5e4',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 6, 2, 8, 4, 11, 16, 13, 20],
    },
  },
  {
    minzoom: 11,
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    filter: ['!', ['has', 'traffic_sign']],
    type: 'line',
    id: 'sign-missing',
    paint: {
      'line-color': '#fda5e4',
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 22, 4],
      'line-opacity': 0.6,
      'line-offset': ['interpolate', ['linear'], ['zoom'], 12, 0, 15, -1],
      'line-dasharray': [3, 1],
    },
  },
  {
    minzoom: 11,
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    filter: ['has', 'traffic_sign'],
    type: 'line',
    id: 'sign-colors',
    paint: {
      'line-color': ['match', ['get', 'traffic_sign'], ['none'], '#00c29e', '#a1e217'],
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 3, 16, 4],
      'line-opacity': 0.6,
    },
  },
]
