import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'parkingPoints'
export type SubcatParkingPointsId = typeof subcatId
export type SubcatParkingPointsStyleIds = 'default'

export const subcat_parkingPoints: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Parkplätze zählen',
  sourceId: 'parkraumParkingPoints',
  beforeId: undefined,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_calculator',
        source: 'parkraumParkingPoints',
        sourceLayer: 'processing.parking_spaces',
      }),
    },
  ],
}
