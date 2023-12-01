import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

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

export const subcat_roadsSurface: MapDataSubcat = {
  id: subcatId,
  name: 'Oberflächenqualität Fahrbahn',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({ group: 'atlas_surface_good', source, sourceLayer }),
    },
    {
      id: 'bad',
      name: 'Schlechte Oberflächen',
      desc: 'Hervorhebung von schlechten Oberflächen.',
      layers: mapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
    },
    {
      id: 'completeness',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: [
        mapboxStyleLayers({ group: 'atlas_surface_present', source, sourceLayer }),
        mapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
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
        mapboxStyleLayers({ group: 'atlas_surface_fresh', source, sourceLayer }),
        mapboxStyleLayers({ group: 'atlas_surface_bad', source, sourceLayer }),
      ].flat(),
      legends: [],
    },
  ],
}
