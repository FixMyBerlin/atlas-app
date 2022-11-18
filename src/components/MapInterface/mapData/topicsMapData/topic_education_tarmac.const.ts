import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'education_tarmac'
const source = 'tarmac_education'
const sourceLayer = 'public.education'
export type TopicEducationId_Tarmac = typeof topic
export type TopicEducationStyleIds_Tarmac = 'default'
export type TopicEducationStyleFilterIds_Tarmac = '_nofilter'

export const topic_education_tarmac: MapDataTopic = {
  id: topic,
  name: 'Bildungseinrichtungen',
  desc: null,
  sourceId: 'tarmac_education',
  allowVerify: false,
  exportOptions: {
    requestType: 'education',
  },
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
