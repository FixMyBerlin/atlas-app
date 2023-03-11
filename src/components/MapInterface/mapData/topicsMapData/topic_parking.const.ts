import { MapDataTopic } from '../types'
import { debugLayerStyles } from './mapboxStyles/debugLayerStyles'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'parking'
const source = 'parkraumParking'
const sourceLayer = 'processing.parking_segments'
export type TopicParkingId = typeof topic
export type TopicParkingStyleIds = 'default' | 'presence' | 'raw'
export type TopicParkingStyleFilterIds = '_nofilter'

export const topic_parking: MapDataTopic = {
  id: topic,
  name: 'Parkraum',
  desc: '(Nur für Berlin da Datenquelle Parkraum)',
  sourceId: 'parkraumParking',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_parkinglines',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
    {
      id: 'presence',
      name: 'Vollständigkeit',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'parking_parkinglines',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'parking_parkinglines_no_null',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'capacity-null',
          name: 'Daten fehlen noch',
          style: {
            type: 'line',
            color: 'rgb(187, 17, 133)',
          },
        },
        {
          id: 'position-no',
          name: 'Parkverbot erfasst',
          style: {
            type: 'line',
            color: 'rgb(102, 21, 168)',
          },
        },
      ],
      interactiveFilters: null,
    },
    {
      id: 'raw',
      name: 'Debug',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
  ],
}
