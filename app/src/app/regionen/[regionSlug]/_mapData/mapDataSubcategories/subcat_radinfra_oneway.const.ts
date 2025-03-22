import { FileMapDataSubcategory, FileMapDataSubcategoryStyleLegend } from '../types'
import { mapboxStyleGroupLayers_radinfra_oneway } from './mapboxStyles/groups/radinfra_oneway'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'bikelanes'
const source = 'atlas_bikelanes'
const sourceLayer = 'bikelanes'
export type SubcatRadinfraOnewayId = typeof subcatId
export type SubcatRadinfraOnewayStyleIds = 'default'

export const bikelanesOnewayLegend: FileMapDataSubcategoryStyleLegend[] = [
  {
    id: 'yes',
    name: 'Eine Richtung',
    style: {
      type: 'line',
      color: '#a1e217',
    },
  },
  {
    id: 'no',
    name: 'Beide Richtungen',
    style: {
      type: 'line',
      color: '#00c29e',
    },
  },
  {
    id: 'no_bike',
    name: 'Beide Richtungen (Fahrrad)',
    style: {
      type: 'line',
      color: '#00c29e',
      dasharray: [3, 2],
    },
  },
  {
    id: 'assumed_no',
    name: 'Zu prüfen: Beide Richtung angenommen',
    style: {
      type: 'line',
      color: '#fda5e4',
      dasharray: [3, 2],
      width: 2,
    },
  },
  {
    id: 'implicit_yes',
    name: 'Zu prüfen: Eine Richtung angenommen',
    style: {
      type: 'line',
      color: '#d8a5fd',
      dasharray: [3, 2],
      width: 2,
    },
  },
]

export const subcat_radinfra_oneway: FileMapDataSubcategory = {
  id: subcatId,
  name: 'RVA Richtungsfreigabe',
  ui: 'checkbox',
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'RVA Richtungsfreigabe', // field hidden
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_radinfra_oneway,
        source,
        sourceLayer,
      }),
      legends: bikelanesOnewayLegend,
    },
  ],
}
