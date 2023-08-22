import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'parking'
const source = 'parkraumParking'
const sourceLayer = 'processing.parking_segments'
export type TopicParkingId = typeof topic
export type TopicParkingStyleIds = 'default' | 'presence' | 'surface' | 'raw'

export const topic_parking: MapDataTopic = {
  id: topic,
  name: 'Parkraum',
  desc: '(Nur für Berlin da Datenquelle Parkraum)',
  sourceId: 'parkraumParking',
  beforeId: undefined,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'parking_parkinglines',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'parking_parkinglines_labels',
          source: 'parkraumParking',
          sourceLayer: 'processing.parking_segments_label',
        }),
      ].flat(),
    },
    {
      id: 'presence',
      name: 'Vollständigkeit',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'parking_parkinglines_labels',
          source: 'parkraumParking',
          sourceLayer: 'processing.parking_segments_label',
        }),
        mapboxStyleLayers({
          group: 'parking_parkinglines_completeness',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'parking_parkinglines',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'capacity_status--data_missing',
          name: 'Parkstände',
          style: {
            type: 'line',
            color: 'rgb(22, 163, 74)',
          },
        },
        {
          id: 'capacity_status--not_processed_yet',
          name: 'Daten fehlen noch',
          style: {
            type: 'line',
            color: 'rgb(187, 17, 133)',
            dasharray: [5, 4],
          },
        },
        {
          id: 'capacity_status--no_parking',
          name: 'Parkverbot erfasst',
          style: {
            type: 'line',
            color: 'rgb(102, 21, 168)',
          },
        },
        {
          id: 'capacity_status--segment_too_small',
          name: 'Segment zu klein',
          style: {
            type: 'line',
            color: 'rgb(102, 21, 168)',
            dasharray: [5, 4],
          },
        },
        {
          id: 'capacity_status-operator_type-private',
          name: 'Privatwege sind halbtransparent',
          style: {
            type: 'line',
            color: 'gray',
          },
        },
      ],
    },
    {
      id: 'surface',
      name: 'Oberflächen',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'parking_parkinglines_labels',
          source: 'parkraumParking',
          sourceLayer: 'processing.parking_segments_label',
        }),
        mapboxStyleLayers({
          group: 'parking_parkinglines_surface',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'surface-soft',
          name: 'Durchlässig',
          style: {
            type: 'line',
            color: 'hsl(142, 94%, 40%)',
          },
        },
        {
          id: 'surface-gaps',
          name: 'Etwas durchlässig',
          style: {
            type: 'line',
            color: 'hsl(164, 92%, 42%)',
          },
        },
        {
          id: 'surface-closed',
          name: 'Undurchlässig',
          style: {
            type: 'line',
            color: 'hsl(344, 93%, 35%)',
          },
        },
        {
          id: 'surface-unknown',
          name: 'Unkategorisiert',
          style: {
            type: 'line',
            color: 'hsl(280, 94%, 63%)',
          },
        },
      ],
    },
  ],
}
