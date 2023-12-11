// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_pois_default: MapboxStyleLayer[] = [
  {
    minzoom: 12,
    layout: {},
    filter: ['has', 'category'],
    type: 'circle',
    id: 'pois-classification',
    paint: {
      'circle-color': [
        'match',
        ['get', 'category'],
        ['Bildung'],
        '#3568de',
        ['Einkauf'],
        '#80e5d1',
        ['Freizeit'],
        '#b1e755',
        ['Grundversorgung'],
        '#f18241',
        '#000000',
      ],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 2.5, 16, 6],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 12.6, 0, 12.9, 1],
      'circle-stroke-width': 1,
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12.6, 0, 12.9, 1],
    },
  },
  {
    minzoom: 17,
    layout: {
      'text-field': ['to-string', ['get', 'name']],
      'text-size': 11,
      'text-offset': [0, 1.5],
    },
    filter: ['has', 'category'],
    type: 'symbol',
    id: 'pois-names',
    paint: {
      'text-color': [
        'match',
        ['get', 'category'],
        ['Bildung'],
        '#19409a',
        ['Einkauf'],
        '#27bea0',
        ['Freizeit'],
        '#77ad1a',
        ['Grundversorgung'],
        '#aa470e',
        '#000000',
      ],
      'text-opacity': ['interpolate', ['linear'], ['zoom'], 12.6, 0, 12.9, 1],
    },
  },
  {
    layout: {},
    maxzoom: 12.9,
    filter: ['has', 'category'],
    type: 'heatmap',
    id: 'pois-heat',
    paint: {
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(191, 0, 255, 0)',
        0.1,
        'rgba(149, 42, 9, 0.1)',
        0.3,
        'rgba(149, 42, 9, 0.4)',
        0.5,
        'rgba(149, 42, 9, 0.6)',
        0.7,
        'rgba(149, 42, 9, 0.8)',
        1,
        '#952a09',
      ],
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10.5,
        0,
        10.6,
        0.9,
        12.6,
        0.9,
        12.9,
        0,
      ],
      'heatmap-weight': 1.5,
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 12, 7],
    },
  },
]
