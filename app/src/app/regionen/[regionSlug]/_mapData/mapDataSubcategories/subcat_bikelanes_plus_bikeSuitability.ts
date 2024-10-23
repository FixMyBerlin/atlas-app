import { FileMapDataSubcategory } from '../types'
import { mapboxStyleGroupLayers_atlas_bikelanes_plus_bikesuitability } from './mapboxStyles/groups/atlas_bikelanes_plus_bikesuitability'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes_plus_bikesuitability'
const source = 'atlas_bikeSuitability'
const sourceLayer = 'bikeSuitability'
export type SubcatBikelanesPlusBikeSuitabilityId = typeof subcatId
export type SubcatBikelanesPlusBikeSuitabilityStyleIds = 'default'
export const subcat_bikelanes_plus_bikesuitability: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Radeignung',
  ui: 'checkbox',
  sourceId: source,
  // beforeId: 'atlas-app-beforeid-group1',
  styles: [
    {
      id: 'default',
      name: 'Radeignung',
      desc: '',
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_plus_bikesuitability,
        source,
        sourceLayer,
      }),
      legends: undefined,
    },
  ],
}
