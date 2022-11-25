import { MapDataTopic } from '../types'
import { tarmacStyle, pickLayersByGroup } from './utils'

const topicId = 'shops_osmscripts'
export type TopicShopsId_Osmscripts = typeof topicId
export type TopicShopsStyleIds_Osmscripts = 'default'
export type TopicShopsStyleFilterIds_Osmscripts = '_nofilter'

export const topic_shops_osmscripts: MapDataTopic = {
  id: topicId,
  name: 'Einkauf etc (osmscripts)',
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
