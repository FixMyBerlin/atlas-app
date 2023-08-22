import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topiId = 'boundaries'
export type TopicBoundariesId = typeof topiId
export type TopicBoundariesStyleIds = 'default' | 'level-8' | 'level-9-10'

export const topic_boundaries: MapDataTopic = {
  id: topiId,
  name: 'Grenzen',
  desc: '',
  sourceId: 'tarmac_boundaries',
  styles: [
    {
      id: 'default',
      name: 'Gemeindeverbund / Amt',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_boundaries',
        source: 'tarmac_boundaries',
        sourceLayer: 'public.boundaries',
        additionalFilter: ['match', ['get', 'admin_level'], ['7'], true, false],
      }),
    },
    {
      id: 'level-8',
      name: 'Gemeinde / Stadt',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_boundaries',
        source: 'tarmac_boundaries',
        sourceLayer: 'public.boundaries',
        additionalFilter: ['match', ['get', 'admin_level'], ['8'], true, false],
      }),
    },
    {
      id: 'level-9-10',
      name: 'Bezirk, Stadtteil',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_boundaries',
        source: 'tarmac_boundaries',
        sourceLayer: 'public.boundaries',
        additionalFilter: ['match', ['get', 'admin_level'], ['9', '10'], true, false],
      }),
    },
  ],
}
