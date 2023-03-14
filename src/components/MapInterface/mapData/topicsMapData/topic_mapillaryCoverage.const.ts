import { MapDataTopic } from '../types'

const topicId = 'mapillaryCoverage'
export type TopicMapillaryCoverageId = typeof topicId
export type TopicMapillaryCoverageStyleIds = 'default'
export type TopicMapillaryCoverageStyleFilterIds = 'panorama'

export const topic_mapillaryCoverage: MapDataTopic = {
  id: topicId,
  name: 'Mapillary',
  desc: null,
  sourceId: 'mapillary_coverage',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
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
          interactive: false,
        },
      ],
      interactiveFilters: null,
      // interactiveFilters: [
      //   {
      //     id: 'panorama',
      //     name: 'Panorama',
      //     filterConfig: { lookupKey: 'is_pano' },
      //     inputType: 'radiobutton',
      //     options: [
      //       { id: 'true', name: 'Ja' },
      //       { id: 'false', name: 'Nein' },
      //       { id: 'nil', name: 'Egal', defaultActive: true },
      //     ],
      //   },
      // ],
    },
  ],
}
