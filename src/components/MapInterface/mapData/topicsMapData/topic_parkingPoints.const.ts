import { MapDataTopic } from '../types'

export type TopicParkingPointsId = 'parkingPoints'
export type TopicParkingPointsStyleIds = 'default'
export type TopicParkingPointsStyleFilterIds = '_nofilter'

type Topic = MapDataTopic

export const topic_parkingPoints: Topic = {
  id: 'parkingPoints',
  name: 'Parkplätze',
  desc: '(Nur für Berlin da Datenquelle Parkraum)',
  sourceId: 'parkraumParkingPoints',
  allowVerify: false,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'parkraumParkingPointsLayer',
          type: 'circle',
          source: 'parkraumParkingPoints',
          'source-layer': 'public.parking_spaces',
          paint: {
            'circle-color': '#d8cd03',
            // 'circle-stroke-color': '#d8cd03',
            // 'circle-opacity': 0.7,
            // 'circle-stroke-width': 2,
            'circle-radius': 10,
          },
        },
      ],
      interactiveFilters: null,
    },
  ],
}
