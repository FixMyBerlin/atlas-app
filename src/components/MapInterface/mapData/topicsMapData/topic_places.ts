import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'places'
export type TopicPlacesId = typeof topic
export type TopicPlacesStyleIds = 'default' | 'circle'

export const topic_places: MapDataTopic = {
  id: topic,
  name: 'Orte',
  desc: null,
  sourceId: 'tarmac_places',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Ortsnamen',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_places',
        source: 'tarmac_places',
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
        source: 'tarmac_places',
        sourceLayer: 'public.places',
      }),
      legends: null,
    },
  ],
}
