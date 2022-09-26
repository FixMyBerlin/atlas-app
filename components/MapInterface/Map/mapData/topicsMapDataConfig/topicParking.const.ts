import { MapDataConfigTopic } from '../types'
import {
  layersDebugLengthPerCapacity,
  layersDefault,
  layersPresence,
} from './parking'

export type TopicParkingId = 'parking'
export type TopicParkingStyleIds =
  | 'default'
  | 'presence'
  | 'debugLengthPerCapacity'
export type TopicParkingStyleFilterIds = ''

type Topic = MapDataConfigTopic

export const topicParking: Topic = {
  id: 'parking',
  name: 'Parkraum',
  desc: '(Nur für Berlin da Datenquelle Parkraum)',
  sourceId: 'parkraumParking',
  defaultVisible: true,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: layersDefault,
      interactiveFilters: null,
    },
    {
      id: 'presence',
      name: 'Vollständigkeit',
      desc: null,
      layers: layersPresence,
      interactiveFilters: null,
    },
    {
      id: 'debugLengthPerCapacity',
      name: 'Debug Lange<>Kapazität',
      desc: null,
      layers: layersDebugLengthPerCapacity,
      interactiveFilters: null,
    },
  ],
}
