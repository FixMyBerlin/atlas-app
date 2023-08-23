import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { atlasStyle, pickLayersByGroup } from './utils'

const topic = 'bikelanes_osmscripts'
export type TopicBikelanesId_Osmscripts = typeof topic
export type TopicBikelanesStyleIds_Osmscripts = 'default' | 'detailed'

export const topic_bikelanes_osmscripts: MapDataTopic = {
  id: topic,
  name: 'Radinfrastruktur (osmscripts)',
  desc: null,
  sourceId: 'osmscripts_highways',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-radinfra'),
    },
    {
      id: 'detailed',
      name: 'Detailliert',
      desc: 'Kleinteilige Kategorisierung',
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-radinfra'),
    },
  ],
}
