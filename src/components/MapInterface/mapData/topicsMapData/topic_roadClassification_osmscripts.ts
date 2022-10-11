import { MapDataTopic } from '../types'
import { pickLayersByGroup, tarmacStyle } from './utils'

const tpoicId = 'roadClassification_osmscripts'
export type TopicRoadClassificationId_Osmscripts = typeof tpoicId
export type TopicRoadClassificationStyleIds_Osmscripts = 'default'
export type TopicRoadClassificationStyleFilterIds_Osmscripts = '_nofilter'

export const topic_roadClassification_osmscripts: MapDataTopic = {
  id: tpoicId,
  name: 'Straßentypen (osmscripts)',
  desc: null,
  sourceId: 'osmscripts_highways',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(tarmacStyle.layers, 'fmc-strassentypen'),
      interactiveFilters: null,
    },
  ],
}
