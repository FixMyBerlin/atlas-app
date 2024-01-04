import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_bikelanes_plus_widths } from './mapboxStyles/groups/atlas_bikelanes_plus_widths'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes_plus_width'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes_verified'
export type SubcatBikelanesPlusWidthId = typeof subcatId
export type SubcatBikelanesPlusWidthStyleIds = 'default'

export const subcat_bikelanes_plus_width: FileMapDataSubcategory = {
  id: subcatId,
  name: 'RVA Breite',
  sourceId: 'atlas_bikelanes',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Breite (Text)',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_plus_widths,
        source,
        sourceLayer,
      }),
      // legends: [...defaultLegend],
    },
  ],
}