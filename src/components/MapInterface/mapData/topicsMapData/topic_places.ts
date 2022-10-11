import { MapDataTopic } from '../types'

const topic = 'places'
export type TopicPlacesId = typeof topic
export type TopicPlacesStyleIds = 'default'
export type TopicPlacesStyleFilterIds = '_nofilter'

export const topic_places: MapDataTopic = {
  id: topic,
  name: 'Orte',
  desc: null,
  sourceId: 'tarmac_places',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'default',
          type: 'circle',
          source: 'tarmac_places',
          'source-layer': 'public.places',
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
