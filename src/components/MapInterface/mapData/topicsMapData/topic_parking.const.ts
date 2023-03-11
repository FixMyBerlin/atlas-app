import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'
import { layersPresence } from './parking'

const topic = 'parking'
const source = 'parkraumParking'
const sourceLayer = 'processing.parking_segments'
export type TopicParkingId = typeof topic
export type TopicParkingStyleIds = 'default' | 'presence'
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
      layers: layersPresence(source, sourceLayer), // TODO
      interactiveFilters: null,
    },
  ],
}
