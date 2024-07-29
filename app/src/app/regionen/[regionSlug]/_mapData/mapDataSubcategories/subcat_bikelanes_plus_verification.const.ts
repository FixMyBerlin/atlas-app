import { FileMapDataSubcategory } from '../types'
import { mapboxStyleGroupLayers_atlas_bikelanes_plus_verification } from './mapboxStyles/groups/atlas_bikelanes_plus_verification'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes_plus_verification'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes'
export type SubcatBikelanesPlusVerificationId = typeof subcatId
export type SubcatBikelanesPlusVerificationStyleIds = 'default'

export const subcat_bikelanes_plus_verification: FileMapDataSubcategory = {
  id: subcatId,
  name: 'RVA Verifizierung (HIDDEN on Production due to missing permission check)',
  ui: 'checkbox',
  sourceId: 'atlas_bikelanes',
  beforeId: 'building',
  styles: [
    {
      id: 'default',
      name: 'Verkehrszeichen',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelanes_plus_verification,
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'missing',
          name: 'Bestätigt',
          style: {
            type: 'line',
            color: 'hsl(107, 88%, 57%)',
          },
        },
        {
          id: 'missing',
          name: 'Zu korrgieren',
          style: {
            type: 'line',
            color: 'hsl(0, 100%, 41%)',
          },
        },
        {
          id: 'missing',
          name: 'Ungeprüft',
          style: {
            type: 'line',
            color: '#fa7fe2',
          },
        },
      ],
    },
  ],
}
