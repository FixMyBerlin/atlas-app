import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_ziele_plus_publictransport } from './mapboxStyles/groups/atlas_ziele_plus_publictransport'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const tpoicId = 'publicTransport'
const source = 'atlas_publicTransport'
const sourceLayer = 'publicTransport'
export type SubcatPublicTransportId = typeof tpoicId
export type SubcatPublicTransportStyleIds = 'default' | 'default_legacy'

export const subcat_publicTransport: FileMapDataSubcategory = {
  id: tpoicId,
  name: 'ÖPNV',
  sourceId: 'atlas_publicTransport',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default_legacy',
      name: 'Standard (Legacy)',
      desc: null,
      layers: legacyMapboxStyleLayers({
        group: 'atlas_publictransport',
        source,
        sourceLayer,
      }),
    },
    // TODO: We will likely have to rename this file to "subcat_poi_plus_publictransport"
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
