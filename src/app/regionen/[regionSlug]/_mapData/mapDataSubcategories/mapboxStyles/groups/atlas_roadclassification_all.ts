// Autogenerated by `scripts/MapboxStyles/process.ts`
// Do not change this file manually

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_roadclassification_all: MapboxStyleLayer[] = [
  {
    filter: [
      'match',
      ['get', 'road'],
      [
        'residential',
        'living_street',
        'bicycle_road',
        'pedestrian',
        'unclassified',
        'residential_priority_road',
        'unspecified_road',
        'service_uncategorized',
        'service_alley',
      ],
      true,
      false,
    ],
    type: 'line',
    id: 'roadclassification-nomainstreet',
    paint: {
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        [
          'case',
          [
            'match',
            ['get', 'road'],
            ['residential_priority_road', 'unclassified', 'living_street'],
            true,
            false,
          ],
          1,
          [
            'match',
            ['get', 'road'],
            [
              'residential',
              'living_street',
              'cycleway',
              'footway_sidewalk',
              'pedestrian',
              'bicycle_road',
              'service_uncategorized',
              'unspecified_road',
              'service_alley',
            ],
            true,
            false,
          ],
          0.5,
          0.8,
        ],
        13,
        [
          'case',
          [
            'match',
            ['get', 'road'],
            ['residential_priority_road', 'unclassified', 'living_street'],
            true,
            false,
          ],
          2,
          [
            'match',
            ['get', 'road'],
            [
              'residential',
              'living_street',
              'cycleway',
              'footway_sidewalk',
              'pedestrian',
              'bicycle_road',
              'service_uncategorized',
              'unspecified_road',
              'service_alley',
            ],
            true,
            false,
          ],
          1,
          0.8,
        ],
        16,
        [
          'case',
          [
            'match',
            ['get', 'road'],
            ['residential_priority_road', 'unclassified', 'living_street'],
            true,
            false,
          ],
          4,
          [
            'match',
            ['get', 'road'],
            [
              'residential',
              'living_street',
              'cycleway',
              'footway_sidewalk',
              'pedestrian',
              'bicycle_road',
              'service_uncategorized',
              'unspecified_road',
              'service_alley',
            ],
            true,
            false,
          ],
          2,
          0.8,
        ],
      ],
      'line-color': [
        'match',
        ['get', 'road'],
        ['residential'],
        '#a2c9f6',
        ['living_street', 'bicycle_road', 'pedestrian'],
        '#447be9',
        ['unclassified', 'residential_priority_road', 'unspecified_road'],
        '#ffdb70',
        ['service_uncategorized', 'service_alley'],
        '#96e4b4',
        'rgba(213, 26, 26, 0.75)',
      ],
    },
  },
  {
    minzoom: 10,
    filter: [
      'match',
      ['get', 'road'],
      ['trunk', 'motorway_link', 'motorway', 'trunk_link'],
      true,
      false,
    ],
    type: 'line',
    id: 'roadclassification_motortrunk',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 14, 1.5, 16, 2],
      'line-color': '#828282',
    },
  },
  {
    minzoom: 11,
    filter: [
      'match',
      ['get', 'road'],
      ['primary', 'tertiary_link', 'secondary_link', 'tertiary', 'secondary', 'primary_link'],
      true,
      false,
    ],
    type: 'line',
    id: 'roadclassification_mainstreets',
    paint: {
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        11,
        [
          'match',
          ['get', 'road'],
          ['primary', 'secondary', 'secondary_link', 'primary_link'],
          3,
          ['tertiary', 'residential_priority_road', 'tertiary_link'],
          2,
          0.8,
        ],
        14,
        [
          'match',
          ['get', 'road'],
          ['primary', 'secondary', 'secondary_link', 'primary_link'],
          8,
          ['tertiary', 'residential_priority_road', 'tertiary_link'],
          7,
          0.8,
        ],
        16,
        [
          'match',
          ['get', 'road'],
          ['primary', 'secondary', 'secondary_link', 'primary_link'],
          24,
          ['tertiary', 'residential_priority_road', 'tertiary_link'],
          16,
          0.8,
        ],
      ],
      'line-color': '#f6e7ac',
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
        'residential',
        'living_street',
        'bicycle_road',
        'pedestrian',
        'unclassified',
        'residential_priority_road',
        'unspecified_road',
        'service_uncategorized',
        'service_alley',
        'primary',
        'tertiary_link',
        'secondary_link',
        'tertiary',
        'secondary',
        'primary_link',
      ],
      true,
      false,
    ],
    type: 'line',
    id: 'hitarea-roadclassification',
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 14.1, 10, 22, 12],
      'line-opacity': 0,
      'line-color': 'rgb(216, 20, 255)',
    },
  },
]
