import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_barriers__area } from './mapboxStyles/groups/atlas_barriers__area'
import { mapboxStyleGroupLayers_atlas_barriers__line } from './mapboxStyles/groups/atlas_barriers__line'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'barriers'
const source = 'atlas_barriers'
export type SubcatBarriersId = typeof subcatId
export type SubcatBarriersStyleIds = 'default'

export const subcat_barriers: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Barrieren',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_atlas_barriers__area,
          source,
          sourceLayer: 'barrierAreas',
        }),
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_atlas_barriers__line,
          source,
          sourceLayer: 'barrierLines',
        }),
      ].flat(),
    },
  ],
}
