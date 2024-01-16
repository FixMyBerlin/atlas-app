import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_boundaries } from './mapboxStyles/groups/atlas_boundaries'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topiId = 'poiBoundaries'
export type SubcatPoiBoundariesId = typeof topiId
export type SubcatPoiBoundariesStyleIds = 'default' | 'level-8' | 'level-9-10'

export const subcat_poi_boundaries: FileMapDataSubcategory = {
  id: topiId,
  name: 'Grenzen',
  ui: 'dropdown',
  sourceId: 'atlas_boundaries',
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Gemeindeverbund / Amt',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_boundaries,
        source: 'atlas_boundaries',
        sourceLayer: 'boundaries',
        additionalFilter: ['match', ['get', 'admin_level'], ['7'], true, false],
      }),
    },
    {
      id: 'level-8',
      name: 'Gemeinde / Stadt',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_boundaries,
        source: 'atlas_boundaries',
        sourceLayer: 'boundaries',
        additionalFilter: ['match', ['get', 'admin_level'], ['8'], true, false],
      }),
    },
    {
      id: 'level-9-10',
      name: 'Bezirk, Stadtteil',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_boundaries,
        source: 'atlas_boundaries',
        sourceLayer: 'boundaries',
        additionalFilter: ['match', ['get', 'admin_level'], ['9', '10'], true, false],
      }),
    },
  ],
}
