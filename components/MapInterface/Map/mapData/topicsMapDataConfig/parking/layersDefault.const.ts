import { MapDataConfigVisLayer } from '../../types'
import { layerLabel } from './layerLabel.const'

export const layersDefault: MapDataConfigVisLayer[] = [
  {
    id: 'line-present',
    type: 'line',
    'source-layer': 'public.parking_segments',
    filter: [
      'all',
      [
        'in',
        'orientation',
        'half_on_kerb',
        'marked',
        'mixed',
        'parallel',
        'perpendicular',
        'street_side',
        'yes',
        'diagonal',
      ],
    ],
    paint: { 'line-width': 4, 'line-color': 'rgba(110, 165, 9, 1)' },
  },
  {
    id: 'line-no',
    type: 'line',
    'source-layer': 'public.parking_segments',
    filter: ['all', ['in', 'orientation', 'no', 'no_parking', 'no_stopping']],
    paint: {
      'line-width': 2,
      'line-color': 'rgba(233, 171, 148, 1)',
    },
  },
  {
    id: 'line-not-present',
    type: 'line',
    'source-layer': 'public.parking_segments',
    filter: [
      'all',
      [
        '!in',
        'orientation',
        'no',
        'no_parking',
        'no_stopping',
        'separate',
        'half_on_kerb',
        'marked',
        'mixed',
        'parallel',
        'perpendicular',
        'street_side',
        'yes',
        'diagonal',
      ],
    ],
    paint: {
      'line-width': 3,
      'line-color': 'rgba(153, 164, 241, 1)',
    },
  },
  layerLabel('capacity'),
]
