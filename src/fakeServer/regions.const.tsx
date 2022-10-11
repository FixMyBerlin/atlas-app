import { MapDataThemeIds, themes } from '@components/MapInterface/mapData'
import React from 'react'

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
  logo: React.ReactNode | null
  themes: MapDataThemeIds[]
}

export type RegionPath = 'bibi' | 'trto' | 'berlin' | 'zes' | 'langerwehe'

export const regions: Region[] = [
  {
    name: 'BiBi',
    fullName: 'Bietigheim-Bissingen',
    path: 'bibi',
    map: { lat: 48.95793, lng: 9.1395, zoom: 13 },
    logo: (
      <img src="/pageRegions/zesplus-logo.png" className="h-6 w-6" alt="" />
    ),
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'lit',
    ],
  },
  {
    name: 'TrTo',
    fullName: 'Treptower Tollensewinkel',
    path: 'trto',
    map: { lat: 53.6774, lng: 13.267, zoom: 10.6 },
    logo: null,
    themes: [
      // The order here specifies the order in the UI
      'bikelanes',
      'lit',
    ],
  },
  {
    name: 'Berlin',
    fullName: 'Berlin Ring',
    path: 'berlin',
    map: { lat: 52.51, lng: 13.41, zoom: 14 },
    logo: null,
    themes: themes.map((t) => t.id),
  },
  {
    name: 'ZES+',
    fullName: 'ZES+',
    path: 'zes',
    map: { lat: 52.35, lng: 13.61, zoom: 12 },
    logo: (
      <img src="/pageRegions/zesplus-logo.png" className="h-6 w-auto" alt="" />
    ),
    themes: [
      // The order here specifies the order in the UI
      'fromTo',
      'bikelanes',
      'roadClassification',
      'surface',
    ],
  },
  {
    name: 'Langerwehe',
    fullName: 'Langerwehe',
    path: 'langerwehe',
    map: { lat: 50.82, lng: 6.37, zoom: 15 },
    logo: null,
    themes: themes.map((t) => t.id),
  },
]
