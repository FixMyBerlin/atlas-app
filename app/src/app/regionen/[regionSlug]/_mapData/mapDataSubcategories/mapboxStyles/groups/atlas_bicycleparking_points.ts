// DO NOT EDIT MANUALLY
// This file was automatically generated by `scripts/MapboxStyles/process.ts`

import { MapboxStyleLayer } from '../types'

export const mapboxStyleGroupLayers_atlas_bicycleparking_points: MapboxStyleLayer[] = [
  {
    layout: {
      'icon-image': [
        'match',
        ['get', 'covered'],
        ['no', 'implicit_no'],
        'parking',
        ['yes'],
        'parking-garage',
        'dot-11',
      ],
    },
    type: 'symbol',
    id: 'bicycleparking-points',
    paint: {},
  },
]
