import { MapDataTopic } from '../types'

export type TopicParkingPointsId = 'parkingPoints'
export type TopicParkingPointsStyleIds = 'default'
export type TopicParkingPointsStyleFilterIds = '_nofilter'

export const topic_parkingPoints: MapDataTopic = {
  id: 'parkingPoints',
  name: 'Parkplätze zählen',
  desc: 'Jeder Punkt ist ein errechneter Stellplatz. Man kann Flächen einzeichnen, für die eine Summe dargestellt wird.',
  sourceId: 'parkraumParkingPoints',
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
