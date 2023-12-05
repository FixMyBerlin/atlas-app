import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'places'
export type SubcatPlacesId = typeof subcatId
export type SubcatPlacesStyleIds = 'default' | 'circle'

export const subcat_places: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Orte',
  sourceId: 'atlas_places',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Siedlungszentren EW-Zahl',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_places',
        source: 'atlas_places',
        sourceLayer: 'places',
      }),
      legends: [
        {
          id: 'place',
          name: 'Orte (Name)',
          style: { type: 'text', color: 'black' },
        },
      ],
    },
    {
      id: 'circle',
      name: 'Siedlungszentren Name',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_placescircle',
        source: 'atlas_places',
        sourceLayer: 'places',
      }),
      legends: [
        {
          id: 'place',
          name: 'Orte (ø prop. EW-Zahl)',
          // TODO: Introduce circleBorder
          style: { type: 'circle', color: '#6D28D9' },
        },
      ],
    },
  ],
}
