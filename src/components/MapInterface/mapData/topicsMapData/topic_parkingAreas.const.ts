import { MapDataTopic } from '../types'

const topic = 'parkingAreas'
export type TopicParkingAreasId = typeof topic
export type TopicParkingAreasStyleIds = 'default'
export type TopicParkingAreasStyleFilterIds = '_nofilter'

export const topic_parkingAreas: MapDataTopic = {
  id: topic,
  name: 'Flächenparkplätze',
  desc: 'Private und öffentliche Parkplätze.',
  sourceId: 'parkraumParkingAreas',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        {
          id: 'parkraumParkingAreasLayer',
          type: 'fill',
          source: 'parkraumParkingAreas',
          'source-layer': 'processing.parking_poly',
          filter: [
            'all',
            ['match', ['get', 'parking'], ['street_side', 'lane'], false, true],
            ['match', ['get', 'amenity'], ['bicycle_parking'], false, true],
          ],
          paint: {
            'fill-color': [
              'case',
              ['match', ['get', 'parking'], ['underground'], true, false],
              'hsl(17, 94%, 81%)',
              ['match', ['get', 'parking'], ['surface'], false, true],
              'hsl(215, 88%, 78%)',
              'hsla(17, 0%, 100%, 0.3)',
            ],
            'fill-opacity': 0.9,
          },
        },
      ],
      interactiveFilters: null,
    },
  ],
}
