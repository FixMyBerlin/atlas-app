import { MapDataTopic } from '../types'

const tpoicId = 'publicTransport_tarmac'
export type TopicPublicTransportId_Tarmac = typeof tpoicId
export type TopicPublicTransportStyleIds_Tarmac = 'default'
export type TopicPublicTransportStyleFilterIds_Tarmac = '_nofilter'

export const topic_publicTransport_tarmac: MapDataTopic = {
  id: tpoicId,
  name: 'ÖPNV',
  desc: null,
  sourceId: 'tarmac_publicTransport',
  allowVerify: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'circle',
          source: 'tarmac_publicTransport',
          'source-layer': 'public.publicTransport',
          paint: {
            'circle-color': 'HotPink',
            'circle-radius': 10,
          },
          enableInspector: true,
          enableCalculator: false,
        },
      ],
      interactiveFilters: null,
    },
  ],
}
