import { MapDataThemeIds, themes } from '@components/MapInterface/mapData'

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
  bbox: { min: [number, number]; max: [number, number] }
  logoPath: string | null
  themes: MapDataThemeIds[]
  osmUsers: number[]
}

export type RegionPath = 'bibi' | 'trto' | 'berlin' | 'zes' | 'langerwehe'

const osmUserAdmins = [
  11881, // http://whosthat.osmz.ru/?q=tordans
  17391407, // http://whosthat.osmz.ru/?q=elsueno
  155680, // http://whosthat.osmz.ru/?q=Henri97
]

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
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'lit',
    ],
    osmUsers: [...osmUserAdmins],
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
    themes: [
      // The order here specifies the order in the UI
      'bikelanes',
      'lit',
    ],
    osmUsers: [...osmUserAdmins],
  },
  {
    name: 'Berlin',
    fullName: 'Berlin Ring',
    path: 'berlin',
    map: { lat: 52.51, lng: 13.41, zoom: 14 },
    bbox: {
      min: [13.2809, 52.46],
      max: [13.4929, 52.5528],
    },
    logoPath: null,
    themes: themes.map((t) => t.id).filter((t) => !t.endsWith('Zes')),
    osmUsers: [...osmUserAdmins],
  },
  {
    name: 'ZES+',
    fullName: 'ZES+',
    path: 'zes',
    map: { lat: 52.35, lng: 13.61, zoom: 12 },
    bbox: {
      // todo, needs the right bbox
      min: [13.2937, 52.5295],
      max: [13.2937, 52.5295],
    },
    logoPath: '/pageRegions/zesplus-logo.png',
    themes: [
      // The order here specifies the order in the UI
      'fromToZes',
      'bikelanesZes',
      'roadClassificationZes',
      'surfaceZes',
    ],
    osmUsers: [...osmUserAdmins],
  },
  {
    name: 'Langerwehe',
    fullName: 'Langerwehe',
    path: 'langerwehe',
    map: { lat: 50.82, lng: 6.37, zoom: 15 },
    bbox: {
      // todo, needs the right bbox
      min: [13.2937, 52.5295],
      max: [13.2937, 52.5295],
    },
    logoPath: null,
    themes: themes.map((t) => t.id).filter((t) => !t.endsWith('Zes')),
    osmUsers: [...osmUserAdmins],
  },
]
