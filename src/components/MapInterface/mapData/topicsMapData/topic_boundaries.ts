import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topiId = 'boundaries'
export type TopicBoundariesId = typeof topiId
export type TopicBoundariesStyleIds = 'default'
export type TopicBoundariesStyleFilterIds = 'admin_level'

export const topic_boundaries: MapDataTopic = {
  id: topiId,
  name: 'Grenzen',
  desc: '',
  sourceId: 'tarmac_boundaries',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_boundaries',
        source: 'tarmac_boundaries',
        sourceLayer: 'public.boundaries',
      }),
      // layers: [
      //   {
      //     id: 'default',
      //     type: 'line',
      //     source: 'vts_boundaries_tiles',
      //     'source-layer': 'public.boundaries',
      //     filter: [
      //       'all',
      //       ['has', 'admin_level'],
      //       // ['match', ['get', 'admin_level'], ['9'], true, false],
      //     ],
      //     paint: {
      //       'line-width': 2,
      //       'line-color': '#9333ea',
      //       'line-opacity': 0.2,
      //     },
      //   },
      // ],
      interactiveFilters: [
        {
          id: 'admin_level',
          name: 'Administrative Ebene',
          filterConfig: { lookupKey: 'admin_level' },
          inputType: 'radiobutton',
          options: [
            { id: '7', name: 'Gemeindeverbund / Amt', defaultActive: false },
            { id: '8', name: 'Gemeinde / Stadt', defaultActive: true },
          ],
        },
      ],
    },
  ],
}
