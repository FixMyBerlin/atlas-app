import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_bikelane_presence } from './mapboxStyles/groups/atlas_bikelane_presence'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanesPresence'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatBikelanesPresenceId = typeof subcatId
export type SubcatBikelanesPresenceStyleIds = 'default'

export const subcat_bikelanesPresence: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Vollständigkeit Radinfrastruktur',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
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
            color: 'rgb(250, 128, 225)',
          },
        },
        {
          id: 'no-bikelane',
          name: 'Kein Radweg',
          style: {
            type: 'line',
            color: 'rgba(248, 216, 216, 0.67)',
          },
        },
        {
          id: 'data-present',
          name: 'RVA vorhanden',
          style: {
            type: 'line',
            color: 'rgba(235, 235, 254, 0.7)',
          },
        },
        {
          id: 'data-not-expected',
          name: 'Keine RVA erwartet',
          desc: [
            'Beispie: Auf der Fahrbahn ist keine RVA erwartet, wenn es bereits links/rechts gesonderte RVA gibt.',
          ],
          style: {
            type: 'line',
            color: 'rgba(230, 230, 230, 0.68)',
          },
        },
      ],
    },
  ],
}
