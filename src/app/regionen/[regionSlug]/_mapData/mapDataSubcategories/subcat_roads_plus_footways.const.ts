import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'roads_plus_footways'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatRoadsPlusFootwaysId = typeof subcatId
export type SubcatRoadsPlusFootwaysStyleIds = 'default'
export const subcat_roads_plus_footways: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Fußweg, Pfad, Sonderweg, u.a.',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Fußweg, Pfad, Sonderweg, u.a.',
      desc: '',
      layers: mapboxStyleLayers({
        group: 'atlas_roadclassification_plus_fusswege',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'x',
          name: '',
          style: { type: 'line', color: '#B4AAC0', width: 2 },
        },
      ],
    },
  ],
}
