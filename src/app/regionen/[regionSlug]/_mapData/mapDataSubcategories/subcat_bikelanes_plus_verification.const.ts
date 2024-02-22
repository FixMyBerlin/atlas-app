import { FileMapDataSubcategory } from '../types'
import { mapboxStyleGroupLayers_atlas_bikelanes_plus_verification } from './mapboxStyles/groups/atlas_bikelanes_plus_verification'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes_plus_verification'
export const subcatBikelanesPlusVerificationSource = 'atlas_bikelanes'
const sourceLayer = 'bikelanes_verified'
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
      layers: [
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_atlas_bikelanes_plus_verification,
          source: subcatBikelanesPlusVerificationSource,
          sourceLayer,
        }),
        mapboxStyleLayers({
          layers: [
            {
              minzoom: 7,
              filter: ['has', 'category'],
              type: 'line',
              id: 'bikelanes-verification-optimitic-update',
              paint: {
                'line-width': ['interpolate', ['linear'], ['zoom'], 9, 5, 13, 8, 18, 20],
                // 'line-color': [
                //   'case',
                //   ['==', ['get', 'verified'], 'approved'],
                //   'hsl(107, 88%, 57%)',
                //   ['==', ['get', 'verified'], 'rejected'],
                //   'hsl(0, 100%, 41%)',
                //   '#fa7fe2',
                // ],
                'line-color': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], true],
                  'blue',
                  ['boolean', ['feature-state', 'hover'], false],
                  'yellow',
                  'gray',
                ],
                'line-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  11.6,
                  0,
                  11.8,
                  1,
                  12.2,
                  1,
                  18,
                  1,
                ],
              },
            },
          ],
          source: subcatBikelanesPlusVerificationSource,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'good',
          name: 'Bestätigt',
          style: {
            type: 'line',
            color: 'hsl(107, 88%, 57%)',
          },
        },
        {
          id: 'bad',
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
