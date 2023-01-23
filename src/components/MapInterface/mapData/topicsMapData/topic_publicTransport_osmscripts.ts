import { MapDataTopic } from '../types'
import { pickLayersByGroup, atlasStyle } from './utils'

const tpoicId = 'publicTransport_osmscripts'
export type TopicPublicTransportId_Osmscripts = typeof tpoicId
export type TopicPublicTransportStyleIds_Osmscripts = 'default'
export type TopicPublicTransportStyleFilterIds_Osmscripts = '_nofilter'

export const topic_publicTransport_osmscripts: MapDataTopic = {
  id: tpoicId,
  name: 'ÖPNV / Barriers (osmscripts)',
  desc: null,
  sourceId: 'osmscripts_pois',
  allowVerify: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-barriers'),
      interactiveFilters: null,
    },
  ],
}
