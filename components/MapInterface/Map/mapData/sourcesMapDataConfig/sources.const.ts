import { MapDataConfigSource } from '../types'

// TODO type MapDataConfigSourcesIds = typeof sources[number]['id']
export type MapDataConfigSourcesIds =
  | 'parkraumParking'
  | 'parkraumBoundaries'
  | 'unfallatlas'
  | 'tarmacHighways'
  | 'tarmacPois'

export const sources: MapDataConfigSource[] = [
  {
    id: 'parkraumParking',
    tiles: 'https://vts.mapwebbing.eu/public.parking_segments/{z}/{x}/{y}.pbf',
  },
  {
    id: 'parkraumBoundaries',
    tiles: 'https://vts.mapwebbing.eu/public.boundaries/{z}/{x}/{y}.pbf',
  },
  {
    id: 'unfallatlas',
    tiles: `https://api.mapbox.com/v4/hejco.5oexnrgf/{z}/{x}/{y}.vector.pbf?sku=101bSz70Afq22&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
  },
  {
    id: 'tarmacHighways',
    // 'https://tiles.osm-berlin.org/tarmac-geo/zes-bb-tt-allhighways/{z}/{x}/{y}.pbf',
    tiles: `https://api.mapbox.com/v4/hejco.d7mywzd3/{z}/{x}/{y}.vector.pbf?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
  },
  {
    id: 'tarmacPois',
    // 'https://tiles.osm-berlin.org/tarmac-geo/zes-bb-tt-poi/{z}/{x}/{y}.pbf',
    tiles: `https://api.mapbox.com/v4/hejco.3hccfujx/{z}/{x}/{y}.vector.pbf?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
  },
]
