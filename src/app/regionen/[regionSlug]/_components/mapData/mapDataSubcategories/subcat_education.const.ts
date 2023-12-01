import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'education'
const source = 'atlas_poiClassification'
const sourceLayer = 'poiClassification'
export type SubcatEducationId = typeof subcatId
export type SubcatEducationStyleIds = 'default'

export const subcat_education: MapDataSubcat = {
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
        group: 'atlas_education',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'children',
          name: 'Kindergarten',
          style: {
            type: 'circle',
            color: 'rgb(119, 23, 171)',
          },
        },
        {
          id: 'older',
          name: 'Schule bis Uni',
          style: {
            type: 'circle',
            color: 'hsl(209, 76%, 38%)',
          },
        },
      ],
    },
  ],
}
