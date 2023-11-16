import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'barriers'
const source = 'atlas_barriers'
export type SubcatBarriersId = typeof subcatId
export type SubcatBarriersStyleIds = 'default'

export const subcat_barriers: MapDataSubcat = {
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
          group: 'atlas_barriers__area',
          source,
          sourceLayer: 'public.barrierAreas',
        }),
        mapboxStyleLayers({
          group: 'atlas_barriers__line',
          source,
          sourceLayer: 'public.barrierLines',
        }),
      ].flat(),
    },
  ],
}
