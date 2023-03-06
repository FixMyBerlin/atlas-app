import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'
import { layersDebugLengthPerCapacity, layersPresence } from './parking'

const topic = 'parking'
const source = 'parkraumParking'
const sourceLayer = 'processing.parking_segments'
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
      layers: mapboxStyleLayers({
        group: 'parking_parkinglines',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
    {
      id: 'presence',
      name: 'Vollständigkeit',
      desc: null,
      layers: layersPresence(source, sourceLayer),
      interactiveFilters: null,
    },
    {
      id: 'debugLengthPerCapacity',
      name: 'Debug Lange<>Kapazität',
      desc: null,
      layers: layersDebugLengthPerCapacity(
        source,
        'processing.parking_segments'
      ),
      interactiveFilters: null,
    },
  ],
}
