import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const tpoicId = 'publicTransport'
const source = 'atlas_publicTransport'
const sourceLayer = 'publicTransport'
export type SubcatPublicTransportId = typeof tpoicId
export type SubcatPublicTransportStyleIds = 'default'

export const subcat_publicTransport: FileMapDataSubcategory = {
  id: tpoicId,
  name: 'ÖPNV',
  sourceId: 'atlas_publicTransport',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: legacyMapboxStyleLayers({
        group: 'atlas_publictransport',
        source,
        sourceLayer,
      }),
    },
  ],
}
