import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { atlasStyle, pickLayersByGroup } from './utils'

const tpoicId = 'roadClassification_osmscripts'
export type TopicRoadClassificationId_Osmscripts = typeof tpoicId
export type TopicRoadClassificationStyleIds_Osmscripts = 'default'

export const topic_roadClassification_osmscripts: MapDataTopic = {
  id: tpoicId,
  name: 'Straßentypen (osmscripts)',
  desc: null,
  sourceId: 'osmscripts_highways',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-strassentypen'),
    },
  ],
}
