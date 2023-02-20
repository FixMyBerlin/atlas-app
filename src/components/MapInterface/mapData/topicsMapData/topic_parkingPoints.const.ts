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
            'circle-color': '#6d28d9',
            'circle-stroke-color': '#fdf4ff',
            'circle-stroke-opacity': 0.9,
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              16,
              0,
              20,
              2,
            ],
            // Config https://studio.mapbox.com/styles/hejco/cl50xbava000u14lyqdo62cdr/edit/#15.68/52.474829/13.434895
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10,
              0,
              17,
              3,
            ],
          },
        },
      ],
      interactiveFilters: null,
    },
  ],
}
