import { MapDataTopic } from '../types'
import { atlasStyle, pickLayersByGroup } from './utils'

const topicId = 'education_osmscripts'
export type TopicEducationId_Osmscripts = typeof topicId
export type TopicEducationStyleIds_Osmscripts = 'default'

export const topic_education_osmscripts: MapDataTopic = {
  id: topicId,
  name: 'Bildungseinrichtungen (osmscripts)',
  desc: null,
  sourceId: 'osmscripts_pois',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-poi'),
    },
  ],
}
