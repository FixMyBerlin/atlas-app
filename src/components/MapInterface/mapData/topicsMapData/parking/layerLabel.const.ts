import { MapDataVisLayer } from '../../types'

// Reminder: Needs to be at the end of the layer list. Last entries are on top.
export const layerLabel = (keyForTextField: string): MapDataVisLayer => {
  return {
    id: 'line-label-capacity',
    type: 'symbol',
    'source-layer': 'public.parking_segments',
    layout: {
      'text-field': `{${keyForTextField}}`,
      'symbol-placement': 'line-center',
    },
    paint: {
      'text-halo-color': 'rgba(255, 255, 255, 1)',
      'text-halo-width': 1,
    },
  }
}
