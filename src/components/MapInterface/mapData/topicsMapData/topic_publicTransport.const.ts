import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const tpoicId = 'publicTransport'
const source = 'tarmac_publicTransport'
const sourceLayer = 'public.publicTransport'
export type TopicPublicTransportId = typeof tpoicId
export type TopicPublicTransportStyleIds = 'default'

export const topic_publicTransport: MapDataTopic = {
  id: tpoicId,
  name: 'ÖPNV',
  desc: null,
  sourceId: 'tarmac_publicTransport',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_publictransport',
        source,
        sourceLayer,
      }),
    },
  ],
}
