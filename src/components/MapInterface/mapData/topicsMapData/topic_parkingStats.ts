import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'parkingStats'
const source = 'parkraumParkingStats'
const sourceLayer = 'processing.boundaries_stats'
export type TopicParkingStatsId = typeof topic
export type TopicParkingStatsStyleIds = 'default' | 'length'
export type TopicParkingStatsStyleFilterIds = 'admin_level'

export const topic_parkingStats: MapDataTopic = {
  id: topic,
  name: 'Statistik',
  desc: 'Auswertung pro adminstrativem Gebiet.',
  sourceId: 'parkraumParkingStats',
  beforeId: undefined,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats',
        source,
        sourceLayer,
      }),
      // layers: [
      //   {
      //     id: 'parkraumParkingStatsLayer',
      //     type: 'fill',
      //     source: 'parkraumParkingStats',
      //     'source-layer': 'processing.boundaries_stats',
      //     paint: {
      //       'fill-color': 'hsl(17, 90%, 80%)',
      //       'fill-opacity': 0.9,
      //     },
      //   },
      // ],
      interactiveFilters: [
        {
          id: 'admin_level',
          name: 'Administrative Ebene',
          filterConfig: { lookupKey: 'admin_level' },
          inputType: 'radiobutton',
          options: [
            { id: '4', name: 'Admin Level 4 / Stadt', defaultActive: false },
            { id: '9', name: 'Admin Level 9 / Bezirk', defaultActive: true },
            { id: '10', name: 'Admin Level 10', defaultActive: false },
          ],
        },
      ],
    },
    {
      id: 'length',
      name: 'Länge (km)',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_stats_length',
        source,
        sourceLayer,
      }),
      interactiveFilters: [
        {
          id: 'admin_level',
          name: 'Administrative Ebene',
          filterConfig: { lookupKey: 'admin_level' },
          inputType: 'radiobutton',
          options: [
            { id: '4', name: 'Admin Level 4 / Stadt', defaultActive: false },
            { id: '9', name: 'Admin Level 9 / Bezirk', defaultActive: true },
            { id: '10', name: 'Admin Level 10', defaultActive: false },
          ],
        },
      ],
    },
  ],
}
