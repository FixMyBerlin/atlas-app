import { MapDataTopic } from '../types'

const topicId = 'shops_tarmac'
export type TopicPoiClassificationId_Tarmac = typeof topicId
export type TopicPoiClassificationStyleIds_Tarmac = 'default'
export type TopicPoiClassificationStyleFilterIds_Tarmac = '_nofilter'

export const topic_poiClassification_tarmac: MapDataTopic = {
  id: topicId,
  name: 'Einkauf etc',
  desc: null,
  sourceId: 'tarmac_poiClassification',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'circle',
          source: 'tarmac_poiClassification',
          'source-layer': 'public.poiClassification',
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
