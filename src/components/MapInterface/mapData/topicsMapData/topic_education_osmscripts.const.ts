import { MapDataTopic } from '../types'
import { tarmacStyle, pickLayersByGroup } from './utils'

const topicId = 'education_osmscripts'
export type TopicEducationId_Osmscripts = typeof topicId
export type TopicEducationStyleIds_Osmscripts = 'default'
export type TopicEducationStyleFilterIds_Osmscripts = '_nofilter'

export const topic_education_osmscripts: MapDataTopic = {
  id: topicId,
  name: 'Bildungseinrichtungen (osmscripts)',
  desc: null,
  sourceId: 'osmscripts_pois',
  allowVerify: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(tarmacStyle.layers, 'fmc-poi'),
      interactiveFilters: null,
    },
  ],
}
