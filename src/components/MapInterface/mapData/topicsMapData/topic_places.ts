import { MapDataTopic } from '../types'
import { MapboxStyleLayerGroupPlacesIds } from './mapboxStyles'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'places'
export type TopicPlacesId = typeof topic
export type TopicPlacesStyleIds = 'default' | MapboxStyleLayerGroupPlacesIds
export type TopicPlacesStyleFilterIds = '_nofilter'

export const topic_places: MapDataTopic = {
  id: topic,
  name: 'Orte',
  desc: null,
  sourceId: 'tarmac_places',
  styles: [
    {
      id: 'default',
      name: 'Ortsnamen',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_places',
        source: 'tarmac_places',
        sourceLayer: 'public.places',
      }),
      interactiveFilters: null,
      legends: null,
    },
    {
      id: 'atlas_placescircle',
      name: 'Ortsname & Einwohner',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_placescircle',
        source: 'tarmac_places',
        sourceLayer: 'public.places',
      }),
      interactiveFilters: null,
      legends: null,
    },
  ],
}
