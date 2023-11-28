import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'places'
export type TopicPlacesId = typeof topic
export type TopicPlacesStyleIds = 'default' | 'circle'

export const topic_places: MapDataTopic = {
  id: topic,
  name: 'Orte',
  desc: null,
  sourceId: 'atlas_places',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Ortsnamen',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_places',
        source: 'atlas_places',
        sourceLayer: 'public.places',
      }),
      legends: null,
    },
    {
      id: 'circle',
      name: 'Ortsname & Einwohner',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_placescircle',
        source: 'atlas_places',
        sourceLayer: 'public.places',
      }),
      legends: null,
    },
  ],
}
