import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_parking_calculator } from './mapboxStyles/groups/parking_calculator'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'parkingPoints'
export type SubcatParkingPointsId = typeof subcatId
export type SubcatParkingPointsStyleIds = 'default'

export const subcat_parkingPoints: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Parkplätze zählen',
  ui: 'dropdown',
  sourceId: 'parkraumParkingPoints',
  beforeId: undefined,
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_parking_calculator,
        source: 'parkraumParkingPoints',
        sourceLayer: 'processing.parking_spaces',
      }),
    },
  ],
}
