import { MapDataTopic } from '../types'
import { MapboxStyleLayerGroupBikelanesIds } from './mapboxStyles'
import { debugStyleLayer } from './mapboxStyles/mapboxStyleLayers'
import { defaultLegend } from './topic_bikelanes'

const topic = 'bikelanesPresence'
export type TopicBikelanesPresenceId = typeof topic
export type TopicBikelanesPresenceStyleIds =
  | 'default'
  | MapboxStyleLayerGroupBikelanesIds
export type TopicBikelanesPresenceStyleFilterIds = '_nofilter'

export const topic_bikelanesPresence: MapDataTopic = {
  id: topic,
  name: 'Vollständigkeit Radinfrastruktur',
  desc: '',
  sourceId: 'tarmac_bikelanesPresence',
  styles: [
    {
      id: 'default',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: debugStyleLayer({
        source: 'tarmac_bikelanesPresence',
        sourceLayer: 'public.bikelanesPresence',
      }),
      // layers: mapboxStyleLayers({
      //   group: 'atlas_bikelanes_complete',
      //   source: 'tarmac_bikelanesPresence',
      //   sourceLayer: 'public.bikelanesPresence',
      // }),
      interactiveFilters: null,
      legends: [
        ...defaultLegend,
        {
          id: 'missing',
          name: 'Daten fehlen',
          style: {
            type: 'line',
            color: 'hsl(312, 92%, 74%)',
          },
        },
      ],
    },
  ],
}
