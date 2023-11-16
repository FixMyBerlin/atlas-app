import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'parkingStats'
const source = 'parkraumParkingStats'
const sourceLayer = 'processing.boundaries_stats'
export type SubcatParkingStatsId = typeof subcatId
export type SubcatParkingStatsStyleIds =
  | 'stats-admin-level-4'
  | 'default'
  | 'stats-admin-level-10'
  | 'length-admin-level-4'
  | 'length-admin-level-9'
  | 'length-admin-level-10'

export const subcat_parkingStats: MapDataSubcat = {
  id: subcatId,
  name: 'Statistik',
  desc: 'Auswertung pro adminstrativem Gebiet.',
  sourceId: 'parkraumParkingStats',
  beforeId: undefined,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'stats-admin-level-4',
      name: 'Stadt: % Erfassung',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats',
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['4'], true, false],
      }),
    },
    {
      id: 'default', // 'stats-admin-level-9',
      name: 'Bezirk: % Erfassung',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats',
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['9'], true, false],
      }),
    },
    {
      id: 'stats-admin-level-10',
      name: 'Stadtteil: % Erfassung',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats',
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['10'], true, false],
      }),
    },
    {
      id: 'length-admin-level-4',
      name: 'Stadt: Länge in km',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats_length',
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['4'], true, false],
      }),
    },
    {
      id: 'length-admin-level-9',
      name: 'Bezirk: Länge in km',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats_length',
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['9'], true, false],
      }),
    },
    {
      id: 'length-admin-level-10',
      name: 'Stadtteil: Länge in km',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats_length',
        source,
        sourceLayer,
        additionalFilter: ['match', ['get', 'admin_level'], ['10'], true, false],
      }),
    },
  ],
}
