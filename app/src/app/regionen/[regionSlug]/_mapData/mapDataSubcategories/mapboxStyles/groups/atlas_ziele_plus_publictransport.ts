// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_ziele_plus_publictransport: MapboxStyleLayer[] = [
  {
    layout: {
      'icon-image': [
        'match',
        ['get', 'category'],
        ['ferry_station'],
        'ferry',
        ['railway_station'],
        'singapore-mrt',
        ['light_rail_station'],
        'S-Bahn_MB',
        ['tram_station'],
        'rail-metro',
        ['subway_station'],
        'de-u-bahn',
        '',
      ],
      'icon-padding': 1,
      'icon-allow-overlap': true,
      'icon-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        8,
        ['match', ['get', 'category'], ['light_rail_station'], 0.6, 0.8],
        11,
        [
          'match',
          ['get', 'category'],
          ['ferry_station'],
          0.8,
          ['light_rail_station'],
          0.6,
          ['subway_station', 'tram_station'],
          0.8,
          1,
        ],
        16,
        [
          'match',
          ['get', 'category'],
          ['ferry_station'],
          0.8,
          ['light_rail_station'],
          1,
          ['subway_station', 'tram_station'],
          0.8,
          1.5,
        ],
      ],
      'text-offset': [5, 0],
      'text-size': 12,
    },
    filter: ['has', 'category'],
    type: 'symbol',
    id: 'publictransport',
    paint: {
      'icon-opacity': [
        'step',
        ['zoom'],
        ['match', ['get', 'category'], ['railway_station'], 1, 0],
        8,
        ['match', ['get', 'category'], ['railway_station'], 1, 0],
        10,
        ['match', ['get', 'category'], ['railway_station'], 1, 0],
        10.1,
        ['match', ['get', 'category'], ['railway_station', 'light_rail_station'], 1, 0],
        12.9,
        ['match', ['get', 'category'], ['railway_station', 'light_rail_station'], 1, 0],
        13,
        [
          'match',
          ['get', 'category'],
          [
            'railway_station',
            'light_rail_station',
            'tram_station',
            'ferry_station',
            'subway_station',
          ],
          1,
          0,
        ],
      ],
    },
  },
]