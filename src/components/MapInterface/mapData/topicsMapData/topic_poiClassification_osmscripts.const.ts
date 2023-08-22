import { MapDataTopic } from '../types'
import { atlasStyle, pickLayersByGroup } from './utils'

const topicId = 'shops_osmscripts'
export type TopicShopsId_Osmscripts = typeof topicId
export type TopicShopsStyleIds_Osmscripts = 'default'

export const topic_shops_osmscripts: MapDataTopic = {
  id: topicId,
  name: 'Einkauf etc (osmscripts)',
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
