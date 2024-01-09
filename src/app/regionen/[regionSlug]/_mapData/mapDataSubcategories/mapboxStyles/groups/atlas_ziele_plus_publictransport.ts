// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_ziele_plus_publictransport: MapboxStyleLayer[] = [
  {
    layout: {
      'icon-image': [
        'match',
        ['get', 'category'],
        ['subway_station'],
        'de-u-bahn',
        ['tram_station'],
        'rail-metro',
        ['light_rail_station'],
        'de-s-bahn',
        ['ferry_station'],
        'ferry',
        ['railway_station'],
        'gb-national-rail',
        'border-dot-13',
      ],
      'icon-padding': 1,
      'icon-allow-overlap': true,
    },
    filter: ['has', 'category'],
    type: 'symbol',
    id: 'publictransport',
    paint: {},
  },
]
