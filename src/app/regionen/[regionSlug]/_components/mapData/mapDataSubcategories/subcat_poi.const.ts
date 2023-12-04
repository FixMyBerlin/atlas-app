import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'poi'
const source = 'atlas_poiClassification'
const sourceLayer = 'poiClassification'
export type SubcatPoiId_Tarmac = typeof subcatId
export type SubcatPoiStyleIds_Tarmac = 'default'

export const subcat_poi: MapDataSubcat = {
  id: subcatId,
  name: 'Quellen & Ziele',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    // TODO "Details" see https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1005-8419&mode=design&t=sIuuLD4vxJJzKOWr-0
    // TODO "Nur S/W"
    // TODO "Bildung und Kitas"
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
  ],
}
