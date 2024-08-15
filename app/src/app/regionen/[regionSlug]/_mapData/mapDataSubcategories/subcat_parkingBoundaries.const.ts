import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_parking_boundaries } from './mapboxStyles/groups/parking_boundaries'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'parkingBoundaries'
const source = 'parkraumParkingStats'
const sourceLayer = 'processing.boundaries_stats'
export type SubcatParkingBoundariesId = typeof subcatId
export type SubcatParkingBoundariesStyleIds =
  | 'boundaries-admin-level-4'
  | 'boundaries-admin-level-9'
  | 'default'

export const subcat_parkingBoundaries: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Grenzen',
  ui: 'dropdown',
  sourceId: source,
  beforeId: undefined,
  styles: [
    defaultStyleHidden,
    {
      id: 'boundaries-admin-level-4',
      name: 'Stadt',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_parking_boundaries,
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['4'], true, false],
      }),
    },
    {
      id: 'boundaries-admin-level-9',
      name: 'Bezirke',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_parking_boundaries,
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['9'], true, false],
      }),
    },
    {
      id: 'default', // 'boundaries-admin-level-10',
      name: 'Stadtteile',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_parking_boundaries,
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['10'], true, false],
      }),
    },
  ],
}
