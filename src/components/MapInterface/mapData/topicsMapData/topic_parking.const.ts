import { MapDataTopic } from '../types'
import {
  layersDebugLengthPerCapacity,
  layersDefault,
  layersPresence,
} from './parking'

const topic = 'parking'
export type TopicParkingId = typeof topic
export type TopicParkingStyleIds =
  | 'default'
  | 'presence'
  | 'debugLengthPerCapacity'
export type TopicParkingStyleFilterIds = '_nofilter'

export const topic_parking: MapDataTopic = {
  id: topic,
  name: 'Parkraum',
  desc: '(Nur für Berlin da Datenquelle Parkraum)',
  sourceId: 'parkraumParking',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: layersDefault('parkraumParking', 'processing.parking_segments'),
      interactiveFilters: null,
    },
    {
      id: 'presence',
      name: 'Vollständigkeit',
      desc: null,
      layers: layersPresence('parkraumParking', 'processing.parking_segments'),
      interactiveFilters: null,
    },
    {
      id: 'debugLengthPerCapacity',
      name: 'Debug Lange<>Kapazität',
      desc: null,
      layers: layersDebugLengthPerCapacity(
        'parkraumParking',
        'processing.parking_segments'
      ),
      interactiveFilters: null,
    },
  ],
}
