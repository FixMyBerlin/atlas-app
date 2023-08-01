import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'education'
const source = 'tarmac_poiClassification'
const sourceLayer = 'public.poiClassification'
export type TopicEducationId = typeof topic
export type TopicEducationStyleIds = 'default'
export type TopicEducationStyleFilterIds = '_nofilter'

export const topic_education: MapDataTopic = {
  id: topic,
  name: 'Bildungseinrichtungen',
  desc: null,
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_education',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
  ],
}
