import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'education'
const source = 'atlas_poiClassification'
const sourceLayer = 'poiClassification'
export type SubcatEducationId = typeof subcatId
export type SubcatEducationStyleIds = 'default'

export const subcat_education: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Bildungseinrichtungen',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_pois_education',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'children',
          name: 'Kindergarten',
          style: {
            type: 'circle',
            color: '#19a1b3',
          },
        },
        {
          id: 'school',
          name: 'Schule',
          style: {
            type: 'circle',
            color: '#1269e2',
          },
        },
        {
          id: 'uni',
          name: 'Uni',
          style: {
            type: 'circle',
            color: '#b070ff',
          },
        },
      ],
    },
  ],
}
