import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { debugLayerStyles } from './mapboxStyles/debugLayerStyles'

const subcatId = 'bicycleParking'
const source = 'atlas_bicycleParking'
const sourceLayerPoints = 'bicycleParking_points'
const sourceLayerAreas = 'bicycleParking_areas'
export type SubcatBicycleParkingId = typeof subcatId
export type SubcatBicycleParkingStyleIds = 'default' | 'witharea'

export const subcat_bicycleParking: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Fahrradstellplätze',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer: sourceLayerPoints,
      }),
      // layers: mapboxStyleLayers({
      //   group: 'atlas_bikeparking_points',
      //   source,
      //   sourceLayer,
      // }),
      // legends: [
      //   {
      //     id: 'children',
      //     name: 'Kindergarten',
      //     style: {
      //       type: 'circle',
      //       color: 'rgb(119, 23, 171)',
      //     },
      //   },
      //   {
      //     id: 'older',
      //     name: 'Schule bis Uni',
      //     style: {
      //       type: 'circle',
      //       color: 'hsl(209, 76%, 38%)',
      //     },
      //   },
      // ],
    },
    {
      id: 'witharea',
      name: 'Mit Flächen',
      desc: null,
      layers: [
        ...debugLayerStyles({
          source,
          sourceLayer: sourceLayerPoints,
        }),
        ...debugLayerStyles({
          source,
          sourceLayer: sourceLayerAreas,
        }),
      ],
      // layers: mapboxStyleLayers({
      //   group: 'atlas_bikeparking_points',
      //   source,
      //   sourceLayer,
      // }),
      // legends: [
      //   {
      //     id: 'children',
      //     name: 'Kindergarten',
      //     style: {
      //       type: 'circle',
      //       color: 'rgb(119, 23, 171)',
      //     },
      //   },
      //   {
      //     id: 'older',
      //     name: 'Schule bis Uni',
      //     style: {
      //       type: 'circle',
      //       color: 'hsl(209, 76%, 38%)',
      //     },
      //   },
      // ],
    },
  ],
}
