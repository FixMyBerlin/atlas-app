import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const tpoicId = 'publicTransport'
const source = 'tarmac_publicTransport'
const sourceLayer = 'public.publicTransport'
export type TopicPublicTransportId = typeof tpoicId
export type TopicPublicTransportStyleIds = 'default'
export type TopicPublicTransportStyleFilterIds = '_nofilter'

export const topic_publicTransport: MapDataTopic = {
  id: tpoicId,
  name: 'ÖPNV',
  desc: null,
  sourceId: 'tarmac_publicTransport',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_publictransport',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
  ],
}
