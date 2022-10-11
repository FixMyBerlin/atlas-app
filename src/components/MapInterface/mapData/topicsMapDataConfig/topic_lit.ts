import { MapDataTopic } from '../types'

const topic = 'lit'
export type TopicLitId = typeof topic
export type TopicLitStyleIds = 'default'
export type TopicLitStyleFilterIds = '_nofilter'

export const topic_lit: MapDataTopic = {
  id: topic,
  name: 'Beleuchtung',
  desc: '',
  sourceId: 'tarmac_lit',
  defaultVisible: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'line',
          source: 'tarmac_lit',
          'source-layer': 'public.lit',
          paint: {
            'line-color': 'HotPink',
            'line-width': 10,
          },
          enableInspector: true,
          enableCalculator: false,
        },
      ],
      interactiveFilters: null,
    },
  ],
}
