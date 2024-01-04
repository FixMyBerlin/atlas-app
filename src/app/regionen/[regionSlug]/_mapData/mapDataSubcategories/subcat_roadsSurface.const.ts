import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const subcatId = 'roadsSurface'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatRoadsSurfaceId = typeof subcatId
export type SubcatRoadsSurfaceStyleIds =
  | 'default'
  | 'bad'
  | 'debug-smoothness'
  | 'completeness'
  | 'freshness'

export const subcat_roadsSurface: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Oberflächenqualität Fahrbahn',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard (Legacy)',
      desc: null,
      layers: legacyMapboxStyleLayers({ group: 'atlas_surface_good', source, sourceLayer }),
    },
    {
      id: 'bad',
      name: 'Schlechte Oberflächen (Legacy)',
      desc: 'Hervorhebung von schlechten Oberflächen.',
      layers: legacyMapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
    },
    {
      id: 'completeness',
      name: 'Inhalte & Vollständigkeit (Legacy)',
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
      name: 'Inhalte & Aktualität (Legacy)',
      desc: null,
      layers: [
        legacyMapboxStyleLayers({ group: 'atlas_surface_fresh', source, sourceLayer }),
        legacyMapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
      ].flat(),
      legends: [],
    },
  ],
}
