import { MapDataTopic } from '../types'

const topicId = 'shops_tarmac'
export type TopicShopsId_Tarmac = typeof topicId
export type TopicShopsStyleIds_Tarmac = 'default'
export type TopicShopsStyleFilterIds_Tarmac = '_nofilter'

export const topic_shops_tarmac: MapDataTopic = {
  id: topicId,
  name: 'Einkauf etc',
  desc: null,
  sourceId: 'tarmac_shops',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'circle',
          source: 'tarmac_shops',
          'source-layer': 'public.fromTo_shopping',
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
