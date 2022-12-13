import { MapDataTopic } from '../types'

const topiId = 'boundaries'
export type TopicBoundariesId = typeof topiId
export type TopicBoundariesStyleIds = 'default'
export type TopicBoundariesStyleFilterIds = '_nofilter'

type Topic = MapDataTopic

export const topic_boundaries: Topic = {
  id: topiId,
  name: 'Grenzen',
  desc: '(Nur für Berlin da Datenquelle Parkraum)',
  sourceId: 'tarmac_boundaries',
  allowVerify: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'line',
          source: 'vts_boundaries_tiles',
          'source-layer': 'public.boundaries',
          filter: ['all', ['>=', 'admin_level', "'10'"]],
          paint: {
            'line-width': 2,
            'line-color': 'rgba(215, 34, 34, 1)',
          },
          enableCalculator: false,
        },
      ],
      interactiveFilters: null,
    },
  ],
}
