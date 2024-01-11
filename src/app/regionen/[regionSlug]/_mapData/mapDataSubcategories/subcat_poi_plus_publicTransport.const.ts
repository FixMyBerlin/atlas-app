import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_ziele_plus_publictransport } from './mapboxStyles/groups/atlas_ziele_plus_publictransport'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const tpoicId = 'poiPlusPublicTransport'
const source = 'atlas_publicTransport'
const sourceLayer = 'publicTransport'
export type SubcatPoiPlusPublicTransportId = typeof tpoicId
export type SubcatPoiPlusPublicTransportStyleIds = 'default' | 'default_legacy'

export const subcat_poi_plus_publicTransport: FileMapDataSubcategory = {
  id: tpoicId,
  name: 'Bahnhöfe',
  ui: 'checkbox',
  sourceId: 'atlas_publicTransport',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_ziele_plus_publictransport,
        source,
        sourceLayer,
      }),
    },
  ],
}
