import { StaticImageData } from 'next/image'
import imageBibi from 'src/app/_components/assets/bibi-logo.svg'
import imageNudafa from 'src/app/_components/assets/nudafa-logo.svg'
import imageParking from 'src/app/_components/assets/parking.svg'
import imageTrTo from 'src/app/_components/assets/trto-logo.png'
import {
  MapDataCategoryId,
  categories,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataCategories/categories.const'
import {
  SourcesRasterIds,
  sourcesBackgroundsRaster,
} from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/sourcesBackgroundsRaster.const'

type StaticRegionInitialMapPositionZoom = {
  lat: number
  lng: number
  zoom: number
}

export type StaticRegion = {
  slug: RegionSlug
  name: string
  fullName: string
  /** @desc 1-n relation IDs, used for the mask and export bbox — @href use https://hanshack.com/geotools/gimmegeodata/ to get the ids */
  osmRelationIds: number[] | []
  map: StaticRegionInitialMapPositionZoom
  /** @desc Used by the download panel to pass to the api endpoint */
  bbox: { min: readonly [number, number]; max: readonly [number, number] } | null
  logoWhiteBackgroundRequired: boolean
  categories: MapDataCategoryId[]
  backgroundSources: SourcesRasterIds[]
  notes: 'osmNotes' | 'atlasNotes' | 'disabled'
  hideDownload?: boolean
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
  'maptiler-satellite-v1',
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

export type RegionSlug =
  | 'bb-kampagne' // Kampagne mit Land Brandenburg
  | 'bb-pg' // Land Brandenburg Projektgruppe
  | 'bb-sg' // Land Brandenburg Steuerungsgruppe
  | 'bb' // Öffentlich, Land Brandenburg
  | 'bb-beteiligung' // Land Brandenburg, für Beteiligung
  | 'berlin'
  | 'bibi'
  | 'deutschland'
  | 'fahrradstellplaetze'
  | 'herrenberg'
  | 'langerwehe'
  | 'lueneburg'
  | 'magdeburg'
  | 'mainz'
  | 'muenchen'
  | 'nudafa'
  | 'ostalbkreis'
  | 'parkraum'
  | 'rs8'
  | 'testing'
  | 'trto'
  | 'woldegk'

export const staticRegion: StaticRegion[] = [
  {
    slug: 'bibi',
    name: 'BiBi',
    fullName: 'Bietigheim-Bissingen',
    osmRelationIds: [1613510],
    map: { lat: 48.95793, lng: 9.1395, zoom: 13 },
    bbox: {
      min: [9.0671, 48.9229],
      max: [9.1753, 48.9838],
    },
    logoPath: imageBibi,
    logoWhiteBackgroundRequired: false,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'parking',
      'mapillary',
    ],
    backgroundSources: defaultBackgroundSources,
    notes: 'osmNotes',
  },
  {
    slug: 'trto',
    name: 'TrTo',
    fullName: 'Treptower Tollensewinkel',
    osmRelationIds: [1427697],
    map: { lat: 53.6774, lng: 13.267, zoom: 10.6 },
    bbox: {
      min: [12.9949, 53.5934],
      max: [13.4782, 53.8528],
    },
    logoPath: imageTrTo,
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources, 'trto-radwege'],
    notes: 'osmNotes',
  },
  {
    slug: 'berlin',
    name: 'Berlin',
    fullName: 'Berlin Ring',
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
    categories: [
      // The order here specifies the order in the UI
      'bikelanes',
      'roads',
      'surface',
      'parking',
      'bicycleParking',
      'poi',
      'mapillary',
    ],
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
    notes: 'osmNotes',
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
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'bicycleParking',
      'mapillary',
    ],
    backgroundSources: defaultBackgroundSources,
    notes: 'osmNotes',
  },
  {
    slug: 'parkraum',
    name: 'Parkraum',
    fullName: 'Parkraumanalyse',
    osmRelationIds: [],
    map: { lat: 52.4918, lng: 13.4261, zoom: 13.5 },
    bbox: null,
    logoPath: imageParking,
    logoWhiteBackgroundRequired: false,
    categories: ['parking', 'poi', 'trafficSigns', 'mapillary'],
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
    hideDownload: true,
    notes: 'osmNotes',
  },
  {
    slug: 'rs8',
    name: 'RS 8',
    fullName: 'Trassenscout RS 8',
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
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'mainz',
    name: 'Mainz',
    fullName: 'radnetz-mainz.de',
    osmRelationIds: [62630],
    map: { lat: 49.9876, lng: 8.2506, zoom: 14 },
    bbox: {
      min: [8.1435156, 49.8955342],
      max: [8.3422611, 50.0353045],
    },
    externalLogoPath: 'https://radnetz-mainz.de/favicon.ico',
    logoWhiteBackgroundRequired: false,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'lueneburg',
    name: 'LK Lüneburg',
    fullName: 'Landkreis Lüneburg',
    osmRelationIds: [2084746],
    map: { lat: 53.2493, lng: 10.4142, zoom: 11.5 },
    bbox: {
      min: [10.041308, 53.0468526],
      max: [11.1957671, 53.385876],
    },
    externalLogoPath:
      'https://www.landkreis-lueneburg.de/_Resources/Static/Packages/Marktplatz.LKLG/Images/Logos/logo.png',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'woldegk',
    name: 'Woldegk',
    fullName: 'Amt Woldegk',
    osmRelationIds: [1419902],
    map: { lat: 53.4613672, lng: 13.5808433, zoom: 11.5 },
    bbox: {
      min: [13.378969848860086, 53.37938986368977],
      max: [13.74006560910362, 53.613911346911244],
    },
    externalLogoPath: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Amt_Woldegk_in_MBS.svg', // There is no better image apparently https://de.wikipedia.org/wiki/Amt_Woldegk
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'ostalbkreis',
    name: 'Ostalbkreis',
    fullName: 'Ostalbkreis',
    osmRelationIds: [62708],
    map: { lat: 48.8364862, lng: 10.092577, zoom: 10 },
    bbox: bboxToMinMax([9.6189511, 48.7145541, 10.4569049, 49.0608132]),
    externalLogoPath: 'https://www.ostalbkreis.de/sixcms/media.php/18/OAK-Logo.svg',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
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
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
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
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
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
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    name: 'Brandenburg',
    fullName: 'Land Brandenburg',
    slug: 'bb',
    osmRelationIds: [62504],
    map: { lat: 52.3968, lng: 13.0342, zoom: 11 },
    bbox: {
      min: [11.2662278, 51.359064],
      max: [14.7658159, 53.5590907],
    },
    externalLogoPath: 'https://brandenburg.de/media_fast/bb1.a.3795.de/logo-brb@2.png',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'bicycleParking',
      'mapillary',
    ],
    backgroundSources: ['brandenburg-dop20', ...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    name: 'Brandenburg Beteiligung',
    fullName: 'Land Brandenburg – Version für Beteiligung',
    slug: 'bb-beteiligung',
    osmRelationIds: [62504],
    map: { lat: 52.3968, lng: 13.0342, zoom: 11 },
    bbox: {
      min: [11.2662278, 51.359064],
      max: [14.7658159, 53.5590907],
    },
    externalLogoPath: 'https://brandenburg.de/media_fast/bb1.a.3795.de/logo-brb@2.png',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'bikelanes-minimal',
      'poi',
      'roads',
      'mapillary',
    ],
    backgroundSources: ['brandenburg-dop20', ...defaultBackgroundSources],
    notes: 'disabled',
  },
  {
    slug: 'bb-pg',
    name: 'Brandenburg Projektgruppe',
    fullName: 'Land Brandenburg – Version für Projektgruppe',
    osmRelationIds: [62504],
    map: { lat: 52.3968, lng: 13.0342, zoom: 11 },
    bbox: {
      min: [11.2662278, 51.359064],
      max: [14.7658159, 53.5590907],
    },
    externalLogoPath: 'https://brandenburg.de/media_fast/bb1.a.3795.de/logo-brb@2.png',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'bicycleParking',
      'mapillary',
    ],
    backgroundSources: ['brandenburg-dop20', ...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'bb-sg',
    name: 'Brandenburg Steuerungsgruppe',
    fullName: 'Land Brandenburg – Version für Steuerungsgruppe',
    osmRelationIds: [62504],
    map: { lat: 52.3968, lng: 13.0342, zoom: 11 },
    bbox: {
      min: [11.2662278, 51.359064],
      max: [14.7658159, 53.5590907],
    },
    externalLogoPath: 'https://brandenburg.de/media_fast/bb1.a.3795.de/logo-brb@2.png',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'poi',
      'bikelanes',
      'roads',
      'surface',
      'bicycleParking',
      'mapillary',
    ],
    backgroundSources: ['brandenburg-dop20', ...defaultBackgroundSources],
    notes: 'atlasNotes',
  },
  {
    name: 'Brandenburg Kampagne',
    fullName: 'Kampagne Radinfrastruktur Brandenburg',
    slug: 'bb-kampagne',
    osmRelationIds: [62504],
    map: { lat: 52.3968, lng: 13.0342, zoom: 11 },
    bbox: {
      min: [11.2662278, 51.359064],
      max: [14.7658159, 53.5590907],
    },
    externalLogoPath: 'https://brandenburg.de/media_fast/bb1.a.3795.de/logo-brb@2.png',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'bikelanes',
      'roads',
      'surface',
      'boundaries',
      'mapillary',
    ],
    backgroundSources: ['brandenburg-dop20', ...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'muenchen',
    name: 'München',
    fullName: 'München',
    osmRelationIds: [62428],
    map: { lat: 48.1566, lng: 11.5492, zoom: 12 },
    bbox: {
      min: [11.360777, 48.0616244],
      max: [11.7229099, 48.2481162],
    },
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    categories: ['bikelanes', 'lit', 'poi', 'roads', 'surface', 'bicycleParking', 'mapillary'],
    backgroundSources: defaultBackgroundSources,
    notes: 'osmNotes',
  },
  {
    name: 'Fahrradstellplätze',
    fullName: 'Fahrradstellplätze',
    slug: 'fahrradstellplaetze',
    osmRelationIds: [],
    map: { lat: 51.07, lng: 13.35, zoom: 5 },
    bbox: {
      min: [5.8663153, 47.2701114],
      max: [15.0419309, 55.099161],
    },
    externalLogoPath:
      'https://raw.githubusercontent.com/rapideditor/temaki/main/icons/bicycle_parked.svg',
    logoWhiteBackgroundRequired: true,
    categories: [
      // The order here specifies the order in the UI
      'bicycleParking',
      'poi',
      'bikelanes',
      'roads',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'deutschland',
    name: 'Download',
    fullName: 'Deutschlandweiter Download',
    osmRelationIds: [],
    map: { lat: 51.07, lng: 13.35, zoom: 5 },
    bbox: {
      min: [5.8663153, 47.2701114],
      max: [15.0419309, 55.099161],
    },
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    categories: [
      // The order here specifies the order in the UI
      'bikelanes',
      'poi',
      'roads',
      'surface',
      'lit',
      'mapillary',
    ],
    backgroundSources: [...defaultBackgroundSources],
    notes: 'osmNotes',
  },
  {
    slug: 'testing',
    name: 'Testing',
    fullName: 'Test new processing',
    osmRelationIds: [],
    map: { lat: 51.07, lng: 13.35, zoom: 5 },
    bbox: {
      min: [5.8663153, 47.2701114],
      max: [15.0419309, 55.099161],
    },
    logoPath: null,
    logoWhiteBackgroundRequired: false,
    categories: categories.map((t) => t.id),
    backgroundSources: sourcesBackgroundsRaster.map((s) => s.id),
    notes: 'osmNotes',
  },
]
