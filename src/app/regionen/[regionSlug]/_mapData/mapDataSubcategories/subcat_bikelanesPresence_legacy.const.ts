import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const subcatId = 'bikelanesPresence_legacy'
const source = 'atlas_bikelanesPresence'
const sourceLayer = 'bikelanesPresence'
export type SubcatBikelanesPresenceIdLegacy = typeof subcatId
export type SubcatBikelanesPresenceStyleIdsLegacy = 'default'

export const subcat_bikelanesPresence_legacy: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Vollständigkeit Radinfrastruktur (OLD)',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Inhalte & Vollständigkeit (Legacy)',
      desc: null,
      layers: legacyMapboxStyleLayers({
        group: 'atlas_old_bikelanespresence_complete',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'missing',
          name: 'Daten fehlen',
          style: {
            type: 'line',
            color: 'hsl(312, 92%, 74%)',
          },
        },
      ],
    },
  ],
}
