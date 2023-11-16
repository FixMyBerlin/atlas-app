import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'

const subcatId = 'buildings'
const source = 'atlas_buildings'
const sourceLayer = 'public.buildings'
export type SubcatBuildingsId = typeof subcatId
export type SubcatBuildingsStyleIds = 'default'

export const subcat_buildings: MapDataSubcat = {
  id: subcatId,
  name: 'Gebäude',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'fill',
          type: 'fill',
          source: source,
          'source-layer': sourceLayer,
          paint: {
            'fill-color': '#27272a',
            'fill-outline-color': '#18181b',
            'fill-opacity': 0.8,
          },
        },
      ],
    },
  ],
}
