// DO NOT EDIT MANUALLY
// This file was automatically generated by `scripts/MapboxStyles/process.ts`

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_roads_mainstreets_classified: MapboxStyleLayer[] = [
  {
    minzoom: 7.7,
    filter: [
      'match',
      ['get', 'road'],
      ['primary', 'primary_link', 'secondary', 'tertiary', 'tertiary_link', 'secondary_link'],
      true,
      false,
    ],
    type: 'line',
    id: 'roadclassification_primary',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 6, 2, 12, 8],
      'line-color': [
        'match',
        ['get', 'road'],
        ['tertiary', 'tertiary_link'],
        '#cab007',
        ['secondary', 'secondary_link'],
        '#07b072',
        ['primary', 'primary_link'],
        '#1992f5',
        'red',
      ],
      'line-opacity': 0.4,
    },
  },
  {
    minzoom: 7.7,
    filter: [
      'match',
      ['get', 'road'],
      ['motorway', 'motorway_link', 'trunk', 'trunk_link'],
      true,
      false,
    ],
    type: 'line',
    id: 'roadclassification_motortrunk copy 2',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 14, 1.5, 16, 2],
      'line-color': '#828282',
    },
  },
  {
    layout: {
      'line-cap': 'round',
    },
    filter: [
      'match',
      ['get', 'road'],
      [
        'primary',
        'tertiary_link',
        'secondary_link',
        'tertiary',
        'secondary',
        'primary_link',
        'trunk',
        'motorway_link',
        'motorway',
        'trunk_link',
      ],
      true,
      false,
    ],
    type: 'line',
    id: 'hitarea-roadclassification copy 2',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 14.1, 10, 22, 12],
      'line-opacity': 0,
      'line-color': 'rgb(216, 20, 255)',
    },
  },
]
