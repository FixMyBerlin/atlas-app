import imageBibi from 'src/app/_components/assets/bibi-logo.svg'
import imageParking from 'src/app/_components/assets/parking.svg'
import imageNudafa from 'src/app/_components/assets/nudafa-logo.svg'
import imageTrTo from 'src/app/_components/assets/trto-logo.png'
import {
  MapDataThemeIds,
  themes,
} from 'src/app/regionen/[regionSlug]/_components/mapData/themesMapData/themes.const'
import { SourcesRasterIds } from 'src/app/regionen/[regionSlug]/_components/mapData/sourcesMapData/sourcesBackgroundsRaster.const'
import { StaticImageData } from 'next/image'
import { adminIds } from 'src/users/components/utils/usersUtils'

type RegionMap = {
  lat: number
  lng: number
  zoom: number
}

export type AdditionalRegionAttributes = {
  name: string
  fullName: string
  slug: RegionPath
  /** @desc 1-n relation IDs, used for the mask and export bbox — @href use https://hanshack.com/geotools/gimmegeodata/ to get the ids */
  osmRelationIds: number[] | []
  map: RegionMap
  /** @desc Used by the download panel to pass to the api endpoint */
  bbox: { min: readonly [number, number]; max: readonly [number, number] } | null
  logoWhiteBackgroundRequired: boolean
  themes: MapDataThemeIds[]
  osmUsers: number[]
  /** @desc published=true regions are visible on production, all others are not */
  published: boolean
  backgroundSources: SourcesRasterIds[]
} & (
  | {
      logoPath: StaticImageData | null
      externalLogoPath?: never
    }
  | {
      logoPath?: never
      externalLogoPath: string | null
    }
)

const bboxToMinMax = (bbox: [number, number, number, number]) => {
  return {
    min: [bbox[2], bbox[1]] as const,
    max: [bbox[0], bbox[3]] as const,
  }
}

const defaultBackgroundSources: SourcesRasterIds[] = [
  'mapnik',
  'esri',
  'maptiler-satellite',
  'mapbox-satellite',
  'cyclosm',
  'thunderforest-opencyclemap',
  'memomaps-transport',
  'thunderforest-transport',
  'thunderforest-landscape',
  'thunderforest-outdoors',
  'waymarkedtrails-cycling',
  'waymarkedtrails-hiking',
  'opentopomap',
]

export type RegionPath =
  | 'berlin'
  | 'bibi'
  | 'deutschland'
  | 'herrenberg'
  | 'landhagen'
  | 'langerwehe'
  | 'lueneburg'
  | 'magdeburg'
  | 'mainz'
  | 'nagold'
  | 'neukloster-warin'
  | 'nudafa'
  | 'ostalbkreis'
  | 'parkraum'
  | 'rs8'
  | 'sigmaringen'
  | 'testing'
  | 'trto'
  | 'woldegk'

// This is our regions "Database" until we have a real one
export const additionalRegionAttributes: AdditionalRegionAttributes[] = [
  {
    name: 'BiBi',
    fullName: 'Bietigheim-Bissingen',
    slug: 'bibi',
    osmRelationIds: [1613510],
    map: { lat: 48.95793, lng: 9.1395, zoom: 13 },
    bbox: {
      min: [9.0671, 48.9229],
      max: [9.1753, 48.9838],
    },
    logoPath: imageBibi,
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'lit',
      'parking',
    ],
    osmUsers: [...adminIds, 12518419, 347746],
    published: true,
    backgroundSources: defaultBackgroundSources,
  },
  {
    name: 'TrTo',
    fullName: 'Treptower Tollensewinkel',
    slug: 'trto',
    osmRelationIds: [1427697],
    map: { lat: 53.6774, lng: 13.267, zoom: 10.6 },
    bbox: {
      min: [12.9949, 53.5934],
      max: [13.4782, 53.8528],
    },
    logoPath: imageTrTo,
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
    slug: 'berlin',
    osmRelationIds: [
      62422,
      // 11905744, // Hundekopf not 'adminstration' and therefore not present
    ],
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
      'areal2023',
      'areal2022',
      'areal2021',
      'areal2020',
      'areal2019',
      'parkraumkarte_neukoelln',
    ],
  },
  {
    slug: 'nudafa',
    name: 'NUDAFA',
    fullName: 'NUDAFA',
    osmRelationIds: [
      55775, // Zeuthen
      55773, //Eichwalde
      55774, // Schulzendorf
      55776, // Wildau
      5583556, // Königs Wusterhausen
      55772, // Schönefeld
    ],
    map: { lat: 52.35, lng: 13.61, zoom: 12 },
    bbox: {
      min: [13.3579, 52.2095],
      max: [13.825, 52.4784],
    },
    logoPath: imageNudafa,
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'lit',
      'mapillary',
    ],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: defaultBackgroundSources,
  },
  {
    name: 'Parkraum',
    fullName: 'Parkraumanalyse',
    slug: 'parkraum',
    osmRelationIds: [],
    map: { lat: 52.4918, lng: 13.4261, zoom: 13.5 },
    bbox: null,
    logoPath: imageParking,
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
    slug: 'rs8',
    osmRelationIds: [
      405292, // Stadt Ludwigsburg
      405291, // Remseck am Neckar
      401697, // Stadt Waiblingen (inkl. Exklave, die wir eigentlich nicht brauchen)
    ],
    map: { lat: 48.8769, lng: 9.2425, zoom: 12 },
    bbox: {
      min: [9.13736562, 48.81051166],
      max: [9.36731192, 48.93255599],
    },
    externalLogoPath: 'https://trassenscout.de/favicon.svg',
    logoWhiteBackgroundRequired: false,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Mainz',
    fullName: 'radnetz-mainz.de',
    slug: 'mainz',
    osmRelationIds: [62630],
    map: { lat: 49.9876, lng: 8.2506, zoom: 14 },
    bbox: {
      min: [8.1435156, 49.8955342],
      max: [8.3422611, 50.0353045],
    },
    externalLogoPath: 'https://radnetz-mainz.de/favicon.ico',
    logoWhiteBackgroundRequired: false,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'LK Lüneburg',
    fullName: 'Landkreis Lüneburg',
    slug: 'lueneburg',
    osmRelationIds: [2084746],
    map: { lat: 53.2493, lng: 10.4142, zoom: 11.5 },
    bbox: {
      min: [10.041308, 53.0468526],
      max: [11.1957671, 53.385876],
    },
    externalLogoPath:
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
    slug: 'neukloster-warin',
    osmRelationIds: [1515757],
    map: { lat: 53.8662395, lng: 11.6846975, zoom: 11.5 },
    bbox: {
      min: [11.534335975016448, 53.75009742157375],
      max: [11.82534463839858, 53.98345643670576],
    },
    externalLogoPath: 'https://layout.verwaltungsportal.de/8383/img/logo.png',
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Landhagen',
    fullName: 'Amt Landhagen',
    slug: 'landhagen',
    osmRelationIds: [1432580],
    map: { lat: 54.102491, lng: 13.3433805, zoom: 11.5 },
    bbox: {
      min: [13.201584130847364, 53.95655346659909],
      max: [13.553934829974303, 54.20224786738606],
    },
    externalLogoPath: 'https://www.landhagen.de/images/logo2.png',
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Woldegk',
    fullName: 'Amt Woldegk',
    slug: 'woldegk',
    osmRelationIds: [1419902],
    map: { lat: 53.4613672, lng: 13.5808433, zoom: 11.5 },
    bbox: {
      min: [13.378969848860086, 53.37938986368977],
      max: [13.74006560910362, 53.613911346911244],
    },
    externalLogoPath: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Amt_Woldegk_in_MBS.svg', // There is no better image apparently https://de.wikipedia.org/wiki/Amt_Woldegk
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: true,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Ostalbkreis',
    fullName: 'Ostalbkreis',
    slug: 'ostalbkreis',
    osmRelationIds: [62708],
    map: { lat: 48.8364862, lng: 10.092577, zoom: 10 },
    bbox: bboxToMinMax([9.6189511, 48.7145541, 10.4569049, 49.0608132]),
    externalLogoPath: 'https://www.ostalbkreis.de/sixcms/media.php/18/OAK-Logo.svg',
    logoWhiteBackgroundRequired: true,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Sigmaringen',
    fullName: 'Stadt Sigmaringen',
    slug: 'sigmaringen',
    osmRelationIds: [2806390],
    map: { lat: 48.0856128, lng: 9.2175234, zoom: 10 },
    // BBox für https://www.openstreetmap.org/relation/2806390
    bbox: bboxToMinMax([8.9341838, 47.817339, 9.6053306, 48.288844]),
    externalLogoPath: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Wappen_Sigmaringen.svg',
    logoWhiteBackgroundRequired: false,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Nagold',
    fullName: 'Stadt Nagold',
    slug: 'nagold',
    osmRelationIds: [2946978],
    map: { lat: 52.1364, lng: 11.6369, zoom: 13 },
    // BBox für https://www.openstreetmap.org/relation/2946978
    bbox: bboxToMinMax([8.5980675, 48.483931, 8.7732994, 48.6419759]),
    externalLogoPath: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/DEU_Nagold_COA.svg',
    logoWhiteBackgroundRequired: false,
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    osmUsers: [...adminIds],
    published: false,
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Langerwehe',
    fullName: 'Gemeinde Langerwehe',
    slug: 'langerwehe',
    osmRelationIds: [162550],
    map: { lat: 50.8176382, lng: 6.3580711, zoom: 12 },
    bbox: {
      min: [6.298514, 50.7564788],
      max: [6.4182952, 50.8355042],
    },
    externalLogoPath: 'https://upload.wikimedia.org/wikipedia/commons/1/12/DEU_Langerwehe_COA.jpg',
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'lit',
    ],
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Herrenberg',
    fullName: 'Stadt Herrenberg',
    slug: 'herrenberg',
    osmRelationIds: [722073],
    map: { lat: 48.5959, lng: 8.8675, zoom: 11 },
    bbox: {
      min: [8.7898756, 48.5602164],
      max: [8.9819058, 48.6392506],
    },
    externalLogoPath: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Wappen_Herrenberg.svg',
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'lit',
    ],
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Magdeburg',
    fullName: 'Stadt Magdeburg',
    slug: 'magdeburg',
    osmRelationIds: [62481],
    map: { lat: 52.1257, lng: 11.6423, zoom: 11 },
    bbox: {
      min: [11.5172379, 52.0237486],
      max: [11.7639936, 52.2283566],
    },
    externalLogoPath: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Wappen_Magdeburg.svg',
    logoWhiteBackgroundRequired: false,
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'lit',
    ],
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Download',
    fullName: 'Deutschlandweiter Download',
    slug: 'deutschland',
    osmRelationIds: [],
    map: { lat: 51.07, lng: 13.35, zoom: 5 },
    bbox: {
      min: [5.8663153, 47.2701114],
      max: [15.0419309, 55.099161],
    },
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    osmUsers: [...adminIds],
    published: false,
    // themes: themes.map((t) => t.id).filter((id) => !id.endsWith('_NEW')),
    themes: ['fromTo', 'bikelanes', 'roadClassification', 'lit'],
    backgroundSources: [...defaultBackgroundSources],
  },
  {
    name: 'Testing',
    fullName: 'Test new processing',
    slug: 'testing',
    osmRelationIds: [],
    map: { lat: 51.07, lng: 13.35, zoom: 5 },
    bbox: {
      min: [5.8663153, 47.2701114],
      max: [15.0419309, 55.099161],
    },
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    osmUsers: [...adminIds],
    published: false,
    themes: themes.map((t) => t.id),
    backgroundSources: [...defaultBackgroundSources],
  },
]
