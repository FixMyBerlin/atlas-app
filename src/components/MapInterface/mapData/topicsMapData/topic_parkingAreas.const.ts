import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'parkingAreas'
const source = 'parkraumParkingAreas'
const sourceLayer = 'processing.parking_poly'
export type TopicParkingAreasId = typeof topic
export type TopicParkingAreasStyleIds = 'default' | 'position-separate'
export type TopicParkingAreasStyleFilterIds = '_nofilter' | 'parking_areas'

export const topic_parkingAreas: MapDataTopic = {
  id: topic,
  name: 'Flächenparkplätze',
  desc: 'Private und öffentliche Parkplätze.',
  sourceId: 'parkraumParkingAreas',
  beforeId: undefined,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'parking_areas',
        source,
        sourceLayer,
      }),
      interactiveFilters: [
        // {
        //   id: 'parking_access',
        //   name: 'Zugang',
        //   filterConfig: { lookupKey: 'access' },
        //   inputType: 'checkbox',
        //   options: [
        //     {
        //       id: 'private',
        //       name: 'Privat',
        //       defaultActive: true,
        //     },
        //     // TODO es fehlt eine Option "alle anzeigen"
        //   ],
        // },
        {
          id: 'parking_areas',
          name: 'Parkflächen',
          filterConfig: { lookupKey: 'parking' },
          inputType: 'checkbox',
          options: [
            {
              id: 'multi-storey',
              name: 'Parkhaus',
              defaultActive: true,
            },
            {
              id: 'underground',
              name: 'Tiefgaragen',
              defaultActive: true,
            },
            {
              id: 'carports',
              name: 'Carports',
              defaultActive: true,
            },
            {
              id: 'carport',
              name: 'Carport (einzeln)',
              defaultActive: true,
            },
            {
              id: 'garages',
              name: 'Garagen',
              defaultActive: true,
            },
            {
              id: 'garage',
              name: 'Garage (einzeln)',
              defaultActive: true,
            },
            {
              id: 'surface',
              name: 'Flächenparkplätze',
              defaultActive: true,
            },
            {
              id: 'street_side',
              name: 'Prozessierte, separat erfasste Parkplätze',
              defaultActive: false, // HIDDEN
            },
          ],
        },
      ],
    },
    // Diese Option ist für den Moment deaktiviert.
    // Ziel ist, dass man die separat erfassten "street_side" Parkstände separat anschauen kann.
    // Das ist zZ gelößt über den Filter. Allerdings ist der Filter nicht ideal, da er erfordert, dass alle values als Filteroption aufgelistet werden. Es gibt noch kein "alles weitere".
    // Eine Alternative wäre, den Stil anzupassen und zwei Stil-Optionen anzubieten.
    // {
    //   id: 'position-separate',
    //   name: 'Parkbuchten',
    //   desc: null,
    //   layers: [
    //     {
    //       id: 'parkraumParkingAreasLayer',
    //       type: 'fill',
    //       source: 'parkraumParkingAreas',
    //       'source-layer': 'processing.parking_poly',
    //       filter: ['all', ['match', ['get', 'amenity'], ['bicycle_parking'], false, true]],
    //       paint: {
    //         'fill-color': [
    //           'case',
    //           ['match', ['get', 'parking'], ['underground', 'multi-storey'], true, false],
    //           'hsl(17, 90%, 80%)',
    //           ['match', ['get', 'parking'], ['surface'], true, false],
    //           'hsl(215, 90%, 80%)',
    //           ['match', ['get', 'parking'], ['street_side'], true, false],
    //           'rgba(22, 163, 74, 0.7)',
    //           'hsl(300, 10%, 80%)',
    //         ],
    //         'fill-opacity': 0.9,
    //       },
    //     },
    //   ],
    //   interactiveFilters: null,
    // },
  ],
}
