import { FileMapDataSubcategory } from '../types'
import { mapboxStyleGroupLayers_atlas_bikelanes_plus_routes } from './mapboxStyles/groups/atlas_bikelanes_plus_routes'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes_plus_routes'
const source = 'atlas_bikeroutes'
const sourceLayer = 'bikeroutes'
export type SubcatBikelanesPlusRoutesId = typeof subcatId
export type SubcatBikelanesPlusRoutesStyleIds = 'default'

export const subcat_bikelanes_plus_routes: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Radrouten',
  ui: 'checkbox',
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'Radrouten',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_plus_routes,
        source,
        sourceLayer,
      }),
      // legends: [...defaultLegend],
    },
  ],
}
