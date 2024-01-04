import { FileMapDataSubcategory, FileMapDataSubcategoryStyleLegend } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_parking_areas } from './mapboxStyles/groups/parking_areas'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'parkingAreas'
const source = 'parkraumParkingAreas'
const sourceLayer = 'processing.parking_poly'
export type SubcatParkingAreasId = typeof subcatId
export type SubcatParkingAreasStyleIds = 'default' | 'street_side'

const defaultLegend = [
  {
    id: 'multi-storey',
    name: 'Parkhaus',
    style: { type: 'fill', color: 'rgb(233, 91, 84)' },
  },
  {
    id: 'underground',
    name: 'Tiefgaragen',
    style: { type: 'fill', color: 'rgb(142, 192, 169)' },
  },
  {
    id: 'carport_s',
    name: 'Garage, Carport (einzeln, merfach)',
    style: { type: 'fill', color: 'rgb(251, 206, 74)' },
  },
  {
    id: 'surface',
    name: 'Flächenparkplätze',
    style: { type: 'fill', color: 'rgb(48, 159, 219)' },
  },
] satisfies FileMapDataSubcategoryStyleLegend[]

export const subcat_parkingAreas: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Flächenparkplätze',
  sourceId: 'parkraumParkingAreas',
  beforeId: undefined,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_parking_areas,
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'parking'], ['street_side'], false, true],
      }),
      legends: defaultLegend,
    },
    {
      id: 'street_side',
      name: 'Parkbuchten',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_parking_areas,
        source,
        sourceLayer,
      }),
      legends: [
        ...defaultLegend,
        {
          id: 'street_side',
          name: 'Separat erfasste Parkplätze',
          style: { type: 'fill', color: 'rgb(48, 159, 219)' },
        },
      ],
    },
  ],
}
