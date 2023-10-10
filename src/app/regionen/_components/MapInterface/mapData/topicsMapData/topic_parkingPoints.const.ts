'use client'

import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'parkingPoints'
export type TopicParkingPointsId = typeof topic
export type TopicParkingPointsStyleIds = 'default'

export const topic_parkingPoints: MapDataTopic = {
  id: topic,
  name: 'Parkplätze zählen',
  desc: 'Jeder Punkt ist ein errechneter Stellplatz. Man kann Flächen einzeichnen, für die eine Summe dargestellt wird.',
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
