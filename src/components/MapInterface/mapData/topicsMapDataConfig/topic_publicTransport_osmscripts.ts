import { MapDataTopic } from '../types'
import { pickLayersByGroup, tarmacStyle } from './utils'

const tpoicId = 'publicTransport_osmscripts'
export type TopicPublicTransportId_Osmscripts = typeof tpoicId
export type TopicPublicTransportStyleIds_Osmscripts = 'default'
export type TopicPublicTransportStyleFilterIds_Osmscripts = '_nofilter'

export const topic_publicTransport_osmscripts: MapDataTopic = {
  id: tpoicId,
  name: 'ÖPNV / Barriers (osmscripts)',
  desc: '',
  sourceId: 'osmscripts_pois',
  defaultVisible: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: '',
      layers: pickLayersByGroup(tarmacStyle.layers, 'fmc-barriers'),
      interactiveFilters: null,
    },
  ],
}
