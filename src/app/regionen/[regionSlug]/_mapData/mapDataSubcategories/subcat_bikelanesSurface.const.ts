import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const subcatId = 'bikelanesSurface'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes'
export type SubcatBikelanesSurfaceId = typeof subcatId
export type SubcatBikelanesSurfaceStyleIds =
  | 'default'
  | 'bad'
  | 'debug-smoothness'
  | 'completeness'
  | 'freshness'

export const subcat_bikelanesSurface: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Oberflächenqualität RVA',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: legacyMapboxStyleLayers({ group: 'atlas_surface_good', source, sourceLayer }),
    },
    {
      id: 'bad',
      name: 'Schlechte Oberflächen',
      desc: 'Hervorhebung von schlechten Oberflächen.',
      layers: legacyMapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
    },
    {
      id: 'completeness',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: [
        legacyMapboxStyleLayers({ group: 'atlas_surface_present', source, sourceLayer }),
        legacyMapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
      ].flat(),
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
    {
      id: 'freshness',
      name: 'Inhalte & Aktualität',
      desc: null,
      layers: [
        legacyMapboxStyleLayers({ group: 'atlas_surface_fresh', source, sourceLayer }),
        legacyMapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
      ].flat(),
      legends: [],
    },
  ],
}
