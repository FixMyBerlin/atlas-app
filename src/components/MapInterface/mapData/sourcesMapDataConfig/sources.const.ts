import { MapDataConfigSource } from '../types'

// TODO type MapDataConfigSourcesIds = typeof sources[number]['id']
export type MapDataConfigSourcesIds =
  | 'parkraumParking'
  | 'boundaries'
  | 'unfallatlas'
  | 'tarmacHighways'
  | 'tarmacPois'
  | 'mapillaryCoverage'
  | 'mapillaryMapfeatures'
  | 'mapillaryTrafficSigns'

export const sources: MapDataConfigSource<MapDataConfigSourcesIds>[] = [
  {
    id: 'parkraumParking',
    tiles: 'https://vts.mapwebbing.eu/public.parking_segments/{z}/{x}/{y}.pbf',
    attributionHtml: 'todo', // TODO
  },
  {
    id: 'boundaries',
    tiles:
      'https://tiles.radverkehrsatlas.de/public.boundaries/{z}/{x}/{y}.pbf',
    attributionHtml:
      'Grenzen: © <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
  {
    id: 'unfallatlas',
    tiles: `https://api.mapbox.com/v4/hejco.5oexnrgf/{z}/{x}/{y}.vector.pbf?sku=101bSz70Afq22&access_token=${
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    }`,
    attributionHtml: 'todo', // TODO
  },
  {
    id: 'tarmacHighways',
    tiles: `https://api.mapbox.com/v4/hejco.d7mywzd3/{z}/{x}/{y}.vector.pbf?access_token=${
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    }`,
    attributionHtml: 'todo', // TODO
  },
  {
    id: 'tarmacPois',
    tiles: `https://api.mapbox.com/v4/hejco.3hccfujx/{z}/{x}/{y}.vector.pbf?access_token=${
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    }`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://www.mapillary.com/developer/api-documentation/#coverage-tiles
    id: 'mapillaryCoverage',
    tiles: `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${
      import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN
    }`,
    minzoom: 0,
    maxzoom: 14,
    attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  },
  {
    // https://www.mapillary.com/developer/api-documentation/#point-tiles
    id: 'mapillaryMapfeatures',
    tiles: `https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}?access_token=${
      import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN
    }`,
    minzoom: 14,
    maxzoom: 14,
    attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  },
  {
    // https://www.mapillary.com/developer/api-documentation/#traffic-sign-tiles
    id: 'mapillaryTrafficSigns',
    tiles: `https://tiles.mapillary.com/maps/vtp/mly_map_feature_traffic_sign/2/{z}/{x}/{y}?access_token=${
      import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN
    }`,
    minzoom: 14,
    maxzoom: 14,
    attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  },
]
