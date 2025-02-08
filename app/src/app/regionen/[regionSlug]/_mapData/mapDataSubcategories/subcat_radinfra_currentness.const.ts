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
    id: 'ok',
    name: '3-6 Jahre', // From 3*365=1.095
    style: {
      type: 'line',
      color: '#f6de09',
    },
  },
  {
    id: 'old',
    name: 'Dringed prüfen (6+ Jahre)', // From 6*365=2.190
    style: {
      type: 'line',
      // color: '#d8035c',
      color: '#fda5e4',
    },
  },
  {
    id: 'missing',
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
