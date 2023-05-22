import { MapDataThemeIds, SourcesRasterIds, themes } from '@components/MapInterface/mapData'
import { adminIds } from './utils'

type RegionMap = {
  lat: number
  lng: number
  zoom: number
}

export type Region = {
  name: string
  fullName: string
  path: RegionPath
  map: RegionMap
  /** @desc Used by the download panel to pass to the api endpoint */
  bbox: { min: [number, number]; max: [number, number] } | null
  logoPath: string | null
  logoWhiteBackgroundRequired: boolean
  themes: MapDataThemeIds[]
  osmUsers: number[]
  /** @desc published=true regions are visible on production, all others are not */
  published: boolean
  backgroundSources: SourcesRasterIds[]
}

const defaultBackgroundSources: SourcesRasterIds[] = [
  'mapnik',
  'esri',
  'cyclosm',
  'thunderforest-opencyclemap',
  'memomaps-transport',
  'thunderforest-transport',
  'thunderforest-landscape',
  'thunderforest-outdoors',
  'waymarkedtrails-cycling',
  'waymarkedtrails-hiking',
]

export type RegionPath =
  | 'berlin'
  | 'bibi'
  | 'deutschland'
  | 'landhagen'
  | 'langerwehe'
  | 'lueneburg'
  | 'mainz'
  | 'neukloster-warin'
  | 'parkraum'
  | 'rs8'
  | 'trto'
  | 'woldegk'
  | 'zes'

// This is our regions "Database" until we have a real one
export const regions: Region[] = [
  {
    name: 'BiBi',
    fullName: 'Bietigheim-Bissingen',
    path: 'bibi',
    map: { lat: 48.95793, lng: 9.1395, zoom: 13 },
    bbox: {
      min: [9.0671, 48.9229],
      max: [9.1753, 48.9838],
    },
    logoPath: '/pageRegions/bibi-logo.svg',
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'lit',
      'parking',
    ],
    osmUsers: [...adminIds],
    published: true,
    backgroundSources: defaultBackgroundSources,
  },
  {
    name: 'TrTo',
    fullName: 'Treptower Tollensewinkel',
    path: 'trto',
    map: { lat: 53.6774, lng: 13.267, zoom: 10.6 },
    bbox: {
      min: [12.9949, 53.5934],
      max: [13.4782, 53.8528],
    },
    logoPath: '/pageRegions/trto-logo.png',
    logoWhiteBackgroundRequired: true,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'lit',
    ],
    osmUsers: [...adminIds, 18058212, 18058219],
    published: true,
    backgroundSources: [...defaultBackgroundSources, 'trto-radwege'],
  },
  {
    name: 'Berlin',
    fullName: 'Berlin Ring',
    path: 'berlin',
    map: { lat: 52.507, lng: 13.367, zoom: 11.8 },
    bbox: {
      min: [13.2809, 52.46],
      max: [13.4929, 52.5528],
    },
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'parking',
      'lit',
    ],
    osmUsers: [...adminIds, 12741863],
    published: false,
    backgroundSources: [
      ...defaultBackgroundSources,
      'strassenbefahrung',
      'alkis',
      'areal2022',
      'areal2021',
      'areal2020',
      'areal2019',
      'parkraumkarte_neukoelln',
    ],
  },
  {
    name: 'ZES+',
    fullName: 'ZES+',
    path: 'zes',
    map: { lat: 52.35, lng: 13.61, zoom: 12 },
    bbox: {
      min: [13.3579, 52.2095],
      max: [13.825, 52.4784],
    },
    logoPath: '/pageRegions/zesplus-logo.png',
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromToZes',
      'fromTo',
      'bikelanesZes',
      'bikelanes',
      'roadClassificationZes',
      'surfaceZes',
      'lit',
      'mapillary',
    ],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: defaultBackgroundSources,
  },
  {
    name: 'Langerwehe',
    fullName: 'Langerwehe',
    path: 'langerwehe',
    map: { lat: 50.82, lng: 6.37, zoom: 15 },
    // todo, needs the right bbox
    bbox: null,
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    themes: themes.map((t) => t.id).filter((t) => !t.endsWith('Zes')),
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: defaultBackgroundSources,
  },
  {
    name: 'Parkraum',
    fullName: 'Parkraumanalyse',
    path: 'parkraum',
    map: { lat: 52.4918, lng: 13.4261, zoom: 13.5 },
    bbox: null,
    logoPath: '/pageRegions/parking.svg',
    logoWhiteBackgroundRequired: false,
    themes: ['parking'],
    osmUsers: [...adminIds], // Note: Not needed, since we don't support verfication, yet
    published: true,
    backgroundSources: [
      ...defaultBackgroundSources,
      'strassenbefahrung',
      'alkis',
      'areal2022',
      'areal2021',
      'areal2020',
      'areal2019',
      'parkraumkarte_neukoelln',
    ],
  },
  {
    name: 'RS 8',
    fullName: 'Trassenscout RS 8',
    path: 'rs8',
    map: { lat: 48.8769, lng: 9.2425, zoom: 12 },
    bbox: {
      min: [9.13736562, 48.81051166],
      max: [9.36731192, 48.93255599],
    },
    logoPath: 'https://trassenscout.de/favicon.svg',
    logoWhiteBackgroundRequired: false,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Mainz',
    fullName: 'radnetz-mainz.de',
    path: 'mainz',
    map: { lat: 49.9876, lng: 8.2506, zoom: 14 },
    bbox: {
      min: [8.1435156, 49.8955342],
      max: [8.3422611, 50.0353045],
    },
    logoPath: 'https://radnetz-mainz.de/favicon.ico',
    logoWhiteBackgroundRequired: false,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'LK Lüneburg',
    fullName: 'Landkreis Lüneburg',
    path: 'lueneburg',
    map: { lat: 53.2493, lng: 10.4142, zoom: 11.5 },
    bbox: {
      min: [10.041308, 53.0468526],
      max: [11.1957671, 53.385876],
    },
    logoPath:
      'https://www.landkreis-lueneburg.de/_Resources/Static/Packages/Marktplatz.LKLG/Images/Logos/logo.png',
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Neukloster Warin',
    fullName: 'Amt Neukloster Warin',
    path: 'neukloster-warin',
    map: { lat: 53.8662395, lng: 11.6846975, zoom: 11.5 },
    bbox: {
      min: [11.534335975016448, 53.75009742157375],
      max: [11.82534463839858, 53.98345643670576],
    },
    logoPath: 'https://layout.verwaltungsportal.de/8383/img/logo.png',
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Landhagen',
    fullName: 'Amt Landhagen',
    path: 'landhagen',
    map: { lat: 54.102491, lng: 13.3433805, zoom: 11.5 },
    bbox: {
      min: [13.201584130847364, 53.95655346659909],
      max: [13.553934829974303, 54.20224786738606],
    },
    logoPath: 'https://www.landhagen.de/images/logo2.png',
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Woldegk',
    fullName: 'Amt Woldegk',
    path: 'woldegk',
    map: { lat: 53.4613672, lng: 13.5808433, zoom: 11.5 },
    bbox: {
      min: [13.378969848860086, 53.37938986368977],
      max: [13.74006560910362, 53.613911346911244],
    },
    logoPath: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Amt_Woldegk_in_MBS.svg', // There is no better image apparently https://de.wikipedia.org/wiki/Amt_Woldegk
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Download',
    fullName: 'Deutschlandweiter Download',
    path: 'deutschland',
    map: { lat: 51.07, lng: 13.35, zoom: 5 },
    bbox: {
      min: [5.8663153, 47.2701114],
      max: [15.0419309, 55.099161],
    },
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    themes: themes.map((t) => t.id).filter((t) => !t.endsWith('Zes')),
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
]
