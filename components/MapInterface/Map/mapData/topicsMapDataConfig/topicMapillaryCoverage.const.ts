import { MapDataConfigTopic } from '../types'

export type TopicMapillaryCoverageId = 'mapillaryCoverage'
export type TopicMapillaryCoverageStyleIds = 'default'
export type TopicMapillaryCoverageStyleFilterIds = ''

type Topic = MapDataConfigTopic

export const topicMapillaryCoverage: Topic = {
  id: 'mapillaryCoverage',
  name: 'Mapillary Fotos',
  desc: 'todo: aktuell erst ab zoom 14-',
  sourceId: 'mapillaryCoverage',
  visible: true,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      visible: true,
      layers: [
        {
          id: 'point',
          type: 'circle',
          source: 'mapillary-source',
          'source-layer': 'image',
          paint: {
            'circle-radius': 2,
            'circle-blur': 0.5,
            'circle-color': 'green',
          },
          enableInspector: false,
          enableCalculator: false,
        },
        {
          id: 'line',
          type: 'line',
          source: 'mapillary-source',
          'source-layer': 'sequence',
          paint: {
            'line-color': 'green',
            'line-opacity': 0.7,
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 14, 1],
          },
          enableInspector: false,
          enableCalculator: false,
        },
      ],
      interactiveFilters: null,
    },
  ],
}
