import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'shops'
const source = 'atlas_poiClassification'
const sourceLayer = 'public.poiClassification'
export type SubcatPoiClassificationId_Tarmac = typeof subcatId
export type SubcatPoiClassificationStyleIds_Tarmac = 'default'

export const subcat_poiClassification_tarmac: MapDataSubcat = {
  id: subcatId,
  name: 'Einkauf u.ä.',
  desc: null,
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
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
