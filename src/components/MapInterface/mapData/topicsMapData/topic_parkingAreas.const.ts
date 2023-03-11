import { MapDataTopic } from '../types'

const topic = 'parkingAreas'
export type TopicParkingAreasId = typeof topic
export type TopicParkingAreasStyleIds = 'default' | 'position-separate'
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
              [
                'match',
                ['get', 'parking'],
                ['underground', 'multi-storey'],
                true,
                false,
              ],
              'hsl(17, 90%, 80%)',
              ['match', ['get', 'parking'], ['surface'], true, false],
              'hsl(215, 90%, 80%)',
              'hsl(300, 10%, 80%)',
            ],
            'fill-opacity': 0.9,
          },
        },
      ],
      interactiveFilters: null,
    },
    {
      id: 'position-separate',
      name: 'Parkbuchten',
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
              [
                'match',
                ['get', 'parking'],
                ['underground', 'multi-storey'],
                true,
                false,
              ],
              'hsl(17, 90%, 80%)',
              ['match', ['get', 'parking'], ['surface'], true, false],
              'hsl(215, 90%, 80%)',
              ['match', ['get', 'parking'], ['street_side'], true, false],
              'rgba(22, 163, 74, 0.7)',
              'hsl(300, 10%, 80%)',
            ],
            'fill-opacity': 0.9,
          },
        },
      ],
      interactiveFilters: null,
    },
  ],
}
