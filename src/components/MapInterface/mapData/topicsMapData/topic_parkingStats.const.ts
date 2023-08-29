import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'parkingStats'
const source = 'parkraumParkingStats'
const sourceLayer = 'processing.boundaries_stats'
export type TopicParkingStatsId = typeof topic
export type TopicParkingStatsStyleIds =
  | 'stats-admin-level-4'
  | 'default'
  | 'stats-admin-level-10'
  | 'length-admin-level-4'
  | 'length-admin-level-9'
  | 'length-admin-level-10'

export const topic_parkingStats: MapDataTopic = {
  id: topic,
  name: 'Statistik',
  desc: 'Auswertung pro adminstrativem Gebiet.',
  sourceId: 'parkraumParkingStats',
  beforeId: undefined,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'stats-admin-level-4',
      name: 'Stadt (Anzahl)',
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
      name: 'Bezirk (Anzahl)',
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
      name: 'Stadtteil (Anzahl)',
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
      name: 'Stadt (Länge in km)',
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
      name: 'Bezirk (Länge in km)',
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
      name: 'Stadtteil (Länge in km)',
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
