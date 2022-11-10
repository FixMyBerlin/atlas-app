import { MapDataTopic } from '../types'

const topicId = 'education_tarmac'
export type TopicEducationId_Tarmac = typeof topicId
export type TopicEducationStyleIds_Tarmac = 'default'
export type TopicEducationStyleFilterIds_Tarmac = '_nofilter'

export const topic_education_tarmac: MapDataTopic = {
  id: topicId,
  name: 'Bildungseinrichtungen',
  desc: null,
  sourceId: 'tarmac_education',
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
          source: 'tarmac_education',
          'source-layer': 'public.education',
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
