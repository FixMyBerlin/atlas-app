import { FileMapDataSubcategory } from '../types'
import { mapboxStyleGroupLayers_atlas_bikelane_presence } from './mapboxStyles/groups/atlas_bikelane_presence'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes_plus_presence'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatBikelanesPlusPresenceId = typeof subcatId
export type SubcatBikelanesPlusPresenceStyleIds = 'default'

export const subcat_bikelanes_plus_presence: FileMapDataSubcategory = {
  id: subcatId,
  name: 'RVA Vollständigkeit',
  ui: 'checkbox',
  sourceId: source,
  beforeId: 'boundary_country_outline',
  styles: [
    {
      id: 'default',
      name: 'Vollständigkeit',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_bikelane_presence,
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'missing',
          name: 'Daten fehlen',
          style: {
            type: 'line',
            color: '#fa80f4',
          },
        },
        {
          id: 'data_no', // cycleway=no
          name: 'Kein Radweg',
          style: {
            type: 'line',
            color: 'rgba(192, 202, 185, 0.67)',
          },
        },
        {
          id: 'data-present',
          name: 'RVA vorhanden',
          style: {
            type: 'line',
            color: 'rgba(174, 199, 244, 0.7)',
          },
        },
        {
          id: 'not_expected',
          name: 'Keine RVA erwartet',
          desc: [
            'Beispiel: Auf der Fahrbahn ist keine RVA erwartet, wenn es bereits links/rechts gesonderte RVA gibt.',
            'Beispiel: Bei Wohnstraßen wiederum ist keine RVA links/rechts erwartet.',
          ],
          style: {
            type: 'line',
            color: 'rgba(218, 226, 223, 0.68)',
          },
        },
      ],
    },
  ],
}
