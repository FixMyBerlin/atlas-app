import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topiId = 'boundaries'
export type SubcatBoundariesId = typeof topiId
export type SubcatBoundariesStyleIds = 'default' | 'level-8' | 'level-9-10'

export const subcat_boundaries: MapDataSubcat = {
  id: topiId,
  name: 'Grenzen',
  desc: '',
  sourceId: 'atlas_boundaries',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Gemeindeverbund / Amt',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_boundaries',
        source: 'atlas_boundaries',
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
        source: 'atlas_boundaries',
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
        source: 'atlas_boundaries',
        sourceLayer: 'public.boundaries',
        additionalFilter: ['match', ['get', 'admin_level'], ['9', '10'], true, false],
      }),
    },
  ],
}
