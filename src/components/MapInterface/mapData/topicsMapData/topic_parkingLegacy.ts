import { MapDataTopic } from '../types'
import { layersDefault, layersPresence } from './parking'

const topic = 'parkingLegacy'
export type TopicParkingLegacyId = typeof topic
export type TopicParkingLegacyStyleIds =
  | 'default'
  | 'presence'
  | 'debugLengthPerCapacity'
export type TopicParkingLegacyStyleFilterIds = '_nofilter'

export const topic_parkingLegacy: MapDataTopic = {
  id: topic,
  name: 'Parkraum (Legacy Schema)',
  desc: '',
  sourceId: 'parkraumParkingLegacy',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: layersDefault('parkraumParkingLegacy', 'public.parking_segments'),
      interactiveFilters: null,
    },
    {
      id: 'presence',
      name: 'Vollständigkeit',
      desc: null,
      layers: layersPresence(
        'parkraumParkingLegacy',
        'public.parking_segments'
      ),
      interactiveFilters: null,
    },
  ],
}
