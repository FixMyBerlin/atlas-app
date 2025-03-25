import { FileMapDataSubcategory, FileMapDataSubcategoryStyleLegend } from '../types'
import { mapboxStyleGroupLayers_radinfra_currentness } from './mapboxStyles/groups/radinfra_currentness'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes'
export type SubcatRadinfraCurrentnesshId = typeof subcatId
export type SubcatRadinfraCurrentnesshStyleIds = 'default'

export const bikelanesCurrentnessLegend: FileMapDataSubcategoryStyleLegend[] = [
  {
    id: 'good',
    name: '1-3 Jahre',
    style: {
      type: 'line',
      color: '#15c65c',
    },
  },
  {
    id: 'check3',
    name: '3-6 Jahre',
    style: {
      type: 'line',
      color: '#b5c615',
    },
  },
  {
    id: 'check6',
    name: '6-10 Jahre',
    style: {
      type: 'line',
      color: '#ffe500',
    },
  },
  {
    id: 'old',
    name: 'Dringed prüfen (10+ Jahre)',
    style: {
      type: 'line',
      color: '#fda5e4',
    },
  },
  {
    id: 'zoom_needed',
    name: 'Auf dieser Zoomstufe können die Daten nicht angezeigt werden',
    style: {
      type: 'line',
      color: 'gray',
    },
  },
]
export const subcat_radinfra_currentness: FileMapDataSubcategory = {
  id: subcatId,
  name: 'RVA Aktualität',
  ui: 'checkbox',
  beforeId: 'atlas-app-beforeid-top',
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'RVA Aktualität', // field hidden
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_radinfra_currentness,
        source,
        sourceLayer,
      }),
      legends: bikelanesCurrentnessLegend,
    },
  ],
}
