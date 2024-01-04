import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_bikelanes_smooth_bad } from './mapboxStyles/groups/atlas_bikelanes_smooth_bad'
import { mapboxStyleGroupLayers_atlas_bikelanes_smooth_default } from './mapboxStyles/groups/atlas_bikelanes_smooth_default'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes_plus_smoothness'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes_verified'
export type SubcatBikelanesPlusSmoothnessId = typeof subcatId
export type SubcatBikelanesPlusSmoothnessStyleIds = 'default' | 'bad'

export const subcat_bikelanes_plus_smoothness: FileMapDataSubcategory = {
  id: subcatId,
  name: 'RVA Oberflächenqualität',
  sourceId: 'atlas_bikelanes',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'bad',
      name: 'Schlechte Oberflächenqualität',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_smooth_bad,
        source,
        sourceLayer,
      }),
      // legends: [...defaultLegend],
    },
    {
      id: 'default',
      name: 'Oberflächenqualität',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_smooth_default,
        source,
        sourceLayer,
      }),
      // legends: [...defaultLegend],
    },
  ],
}
