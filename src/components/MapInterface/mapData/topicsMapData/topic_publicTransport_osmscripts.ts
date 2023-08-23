import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { atlasStyle, pickLayersByGroup } from './utils'

const tpoicId = 'publicTransport_osmscripts'
export type TopicPublicTransportId_Osmscripts = typeof tpoicId
export type TopicPublicTransportStyleIds_Osmscripts = 'default'

export const topic_publicTransport_osmscripts: MapDataTopic = {
  id: tpoicId,
  name: 'ÖPNV / Barriers (osmscripts)',
  desc: null,
  sourceId: 'osmscripts_pois',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-barriers'),
    },
  ],
}
