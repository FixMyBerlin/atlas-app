import { MapDataTopic } from '../types'

const topic = 'landuse'
export type TopicLanduseId = typeof topic
export type TopicLanduseStyleIds = 'default'
export type TopicLanduseStyleFilterIds = '_nofilter'

export const topic_landuse: MapDataTopic = {
  id: topic,
  name: 'Wohn- und Gewerbegebiete',
  desc: null,
  sourceId: 'tarmac_landuse',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'fill',
          source: 'tarmac_landuse',
          'source-layer': 'public.fromTo_landuse',
          paint: {
            'fill-color': 'HotPink',
            'fill-outline-color': 'DeepPink',
            'fill-opacity': 0.1,
          },
          enableInspector: true,
          enableCalculator: false,
        },
      ],
      interactiveFilters: null,
    },
  ],
  // styles: [
  //   {
  //     id: 'default',
  //     name: 'Standard',
  //     desc: null,
  //     layers: pickLayersByGroup(tarmacStyle.layers, 'fmc-settlements'),
  //     interactiveFilters: null,
  //   },
  // ],
}
