type RegionMap = {
  lat: number
  lng: number
  zoom: number
}
export type Region = {
  name: string
  path: string
  map: RegionMap
}

export const regions: Region[] = [
  {
    name: 'BiBi',
    path: 'bibi',
    map: { lat: 48.95793, lng: 9.1395, zoom: 13 },
  },
  {
    name: 'TrTo',
    path: 'trto',
    map: { lat: 53.6774, lng: 13.267, zoom: 10.6 },
  },
  {
    name: 'ZES+',
    path: 'zes',
    map: { lat: 52.35, lng: 13.61, zoom: 12 },
  },
]

export const regionFromPath = (regionPath: string) => {
  return regions.find((r) => r.path === regionPath)
}
