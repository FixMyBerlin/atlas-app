import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const tpoicId = 'publicTransport'
const source = 'atlas_publicTransport'
const sourceLayer = 'publicTransport'
export type SubcatPublicTransportId = typeof tpoicId
export type SubcatPublicTransportStyleIds = 'default'

export const subcat_publicTransport: MapDataSubcat = {
  id: tpoicId,
  name: 'ÖPNV',
  sourceId: 'atlas_publicTransport',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_publictransport',
        source,
        sourceLayer,
      }),
    },
  ],
}
