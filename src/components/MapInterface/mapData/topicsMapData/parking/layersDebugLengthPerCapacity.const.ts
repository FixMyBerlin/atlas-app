import { MapDataVisLayer } from '../../types'
import { layerLabel } from './layerLabel.const'

export const layersDebugLengthPerCapacity: MapDataVisLayer[] = [
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
    paint: { 'line-width': 4, 'line-color': 'rgba(110, 165, 9, 0.5)' },
  },
  {
    id: 'line-no',
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
      ['>', 'length_per_capacity', 10],
    ],
    paint: {
      'line-width': 4,
      'line-color': '#ff0000',
    },
  },
  layerLabel('length_per_capacity'),
]
