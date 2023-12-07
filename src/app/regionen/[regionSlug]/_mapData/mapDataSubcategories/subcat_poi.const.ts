import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'poi'
const source = 'atlas_poiClassification'
const sourceLayer = 'poiClassification'
export type SubcatPoiId_Tarmac = typeof subcatId
export type SubcatPoiStyleIds_Tarmac = 'default' | 'education'

export const subcat_poi: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Quellen & Ziele',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    // TODO "Details" see https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1005-8419&mode=design&t=sIuuLD4vxJJzKOWr-0
    // TODO "Nur S/W"
    {
      id: 'default',
      name: 'Einfach',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_poiclassification',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'freizeit',
          name: 'Freizeit',
          style: { type: 'circle', color: '#960854' },
        },
        {
          id: 'bildung',
          name: 'Bildung',
          style: { type: 'circle', color: '#626060' },
        },
        {
          id: 'besorgungen',
          name: 'Grundversorgung',
          style: { type: 'circle', color: '#e709fb' },
        },
        {
          id: 'einkauf',
          name: 'Einkauf',
          style: { type: 'circle', color: '#0e3ecd' },
        },
      ],
    },
    {
      id: 'education',
      name: 'Bildung und Kitas',
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
