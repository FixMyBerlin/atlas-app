import { SourceDatasets } from './sourcesDatasets.const'
import { sourceDatasetIdUrl } from './utils/sourceDatasetIdUrl'

export const sourcesDatasetsBerlin: SourceDatasets = [
  {
    regionKey: ['berlin', 'parkraum'],
    ...sourceDatasetIdUrl('berlin-parking-zones-fisbroker'),
    name: 'Parkzonen',
    type: 'vector',
    // https://fbinter.stadt-berlin.de/fb/index.jsp?loginkey=alphaDataStart&alphaDataId=s_parkraumbewirt@senstadt
    attributionHtml: 'Geoportal Berlin / Parkraumbewirtschaftung',
    inspector: { enabled: false },
    layers: [
      {
        id: 'parkraumzonen-linie',
        type: 'line',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 3,
        },
      },
      {
        id: 'parkraumzonen-linieinner',
        type: 'line',
        paint: {
          'line-color': '#f59e0b',
          'line-opacity': 0.31,
          'line-width': 6,
          'line-offset': 4,
        },
      },
      {
        id: 'parkraumzonen-label',
        type: 'symbol',
        paint: {
          'text-color': '#fffbeb',
          'text-halo-color': '#f59e0b',
          'text-halo-width': 3,
          'text-opacity': 1,
        },
        layout: {
          'text-line-height': 1.1,
          'text-size': 14,
          'text-radial-offset': 0,
          'text-allow-overlap': true,
          'symbol-avoid-edges': true,
          'text-ignore-placement': true,
          'symbol-placement': 'line',
          'text-justify': 'auto',
          'text-padding': 0,
          'text-offset': [0, 0.7],
          'text-field': [
            'concat',
            ['to-string', ['get', 'bezirk']],
            ' ',
            ['to-string', ['get', 'parkzone']],
          ],
        },
      },
    ],
  },
  {
    regionKey: ['parkraum'], // TODO after data was published: ['berlin', 'parkraum'],
    ...sourceDatasetIdUrl('berlin-parking-polygons-euvm'),
    name: 'Parkflächen eUVM-Projekt',
    description: '(!) Ungeprüfter Datensatz des Förderprojekts eUVM der SenUMVK', // Note: "(!)" makes the line red
    type: 'vector',
    attributionHtml: 'eUVM/SenUMVK', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      disableTranslations: true,
      documentedKeys: [
        'ParkingSpaceIsMarked',
        'IsParkingSpace',
        'RestrictionForDifferentWeekdays',
        'CalculatedParkingSpace',
        'Direction',
        'ParkPosition',
        'ResidentsParkForFree',
        'Price',
        'Construction',
        'Date',
        'IsForMedicalStaff',
        'RestrictionDetails',
        'MaxTimeToParkWeekDays',
        'Name',
        'Notes',
        'ChargerForEV',
        'MaxTimeToPark',
        'CarSharing',
        'Restriction',
        'ParkingAllowed',
        'RestrictionReason',
        'IsForDisabled',
        'PaymentNecessary',
        'StartingPoint',
        'zone',
        'street_id',
      ],
    },
    layers: [
      {
        id: 'parking_area',
        type: 'fill',
        paint: {
          'fill-color': [
            'case',
            ['match', ['get', 'IsParkingSpace'], ['true'], true, false],
            'hsl(17, 90%, 80%)',
            ['match', ['get', 'parking'], ['surface'], true, false],
            'hsl(215, 90%, 80%)',
            '#307058',
          ],
          'fill-opacity': 0.9,
        },
      },
    ],
  },
]
