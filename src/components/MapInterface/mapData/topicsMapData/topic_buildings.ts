import { MapDataTopic } from '../types'

const topic = 'buildings'
const source = 'tarmac_buildings'
const sourceLayer = 'public.buildings'
export type TopicBuildingsId = typeof topic
export type TopicBuildingsStyleIds = 'default'
export type TopicBuildingsStyleFilterIds = '_nofilter'

export const topic_buildings: MapDataTopic = {
  id: topic,
  name: 'Gebäude',
  desc: null,
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'fill',
          type: 'fill',
          source: source,
          'source-layer': sourceLayer,
          paint: {
            'fill-color': '#27272a',
            'fill-outline-color': '#18181b',
            'fill-opacity': 0.8,
          },
        },
      ],
      interactiveFilters: null,
    },
  ],
}
