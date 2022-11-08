import { MapDataSource } from '../types'
import { getCurrentTilesUrl } from '@components/utils/getTilesUrl'

// TODO type MapDataConfigSourcesIds = typeof sources[number]['id']
export type SourcesIds =
  | 'accidents_unfallatlas'
  | 'mapillary_coverage'
  | 'mapillary_mapfeatures'
  | 'mapillary_trafficSigns'
  | 'osmscripts_highways'
  | 'osmscripts_pois'
  | 'parkraumParking'
  | 'tarmac_bikelanes'
  | 'tarmac_boundaries'
  | 'tarmac_education'
  | 'tarmac_landuse'
  | 'tarmac_lit'
  | 'tarmac_places'
  | 'tarmac_poiClassification'
  | 'tarmac_publicTransport'
  | 'tarmac_roadClassification'

// https://account.mapbox.com/access-tokens
// "Default public token"
const apiKeyMapbox =
  'pk.eyJ1IjoiaGVqY28iLCJhIjoiY2piZjd2bzk2MnVsMjJybGxwOWhkbWxpNCJ9.L1UNUPutVJHWjSmqoN4h7Q'

// https://www.mapillary.com/dashboard/developers
// "Tarmac OSM Viewer", they call it "Client Token"
const apiKeyMapillary = 'MLY|5337311709720950|61508fdcc416406fd8dfb79748463852'

const tilesUrl = getCurrentTilesUrl()

export const sources: MapDataSource<SourcesIds>[] = [
  {
    id: 'parkraumParking',
    tiles: 'https://vts.mapwebbing.eu/public.parking_segments/{z}/{x}/{y}.pbf',
    attributionHtml: 'todo', // TODO
  },
  {
    id: 'tarmac_boundaries',
    tiles: `${tilesUrl}/public.boundaries/{z}/{x}/{y}.pbf`,
    attributionHtml:
      'Grenzen: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    licence: 'ODbL',
  },
  {
    id: 'accidents_unfallatlas',
    // TODO Migrieren auf Maptiler
    tiles: `https://api.mapbox.com/v4/hejco.5oexnrgf/{z}/{x}/{y}.vector.pbf?sku=101bSz70Afq22&access_token=${apiKeyMapbox}`,
    attributionHtml: 'todo', // TODO
  },
  {
    // Temporary, nur für den Datenabgleich
    // https://studio.mapbox.com/tilesets/hejco.d7mywzd3/
    id: 'osmscripts_highways',
    tiles: `https://api.mapbox.com/v4/hejco.d7mywzd3/{z}/{x}/{y}.vector.pbf?access_token=${apiKeyMapbox}`,
    attributionHtml: 'todo', // TODO
  },
  {
    // Temporary, nur für den Datenabgleich
    // https://studio.mapbox.com/tilesets/hejco.3hccfujx/
    id: 'osmscripts_pois',
    tiles: `https://api.mapbox.com/v4/hejco.3hccfujx/{z}/{x}/{y}.vector.pbf?access_token=${apiKeyMapbox}`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.roadtypesOsm.json
    id: 'tarmac_roadClassification',
    tiles: `${tilesUrl}/public.roadtypesOsm/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.roadtypesOsm.json
    id: 'tarmac_bikelanes',
    tiles: `${tilesUrl}/public.bicycleRoadInfrastructure/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.fromTo_publicTransport.json
    id: 'tarmac_publicTransport',
    tiles: `${tilesUrl}/public.fromTo_publicTransport/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.fromTo_education.json
    id: 'tarmac_education',
    tiles: `${tilesUrl}/public.fromTo_education/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.poiClassification.json
    id: 'tarmac_poiClassification',
    tiles: `${tilesUrl}/public.poiClassification/{z}/{x}/{y}.pbf`,
    attributionHtml:
      'Geschäfte (u.ä.): © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    licence: 'ODbL',
  },
  {
    // https://tiles.radverkehrsatlas.de/public.lit.json
    id: 'tarmac_lit',
    tiles: `${tilesUrl}/public.lit/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.places.json
    id: 'tarmac_places',
    tiles: `${tilesUrl}/public.places/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.fromTo_landuse.json
    id: 'tarmac_landuse',
    tiles: `${tilesUrl}/public.fromTo_landuse/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
  },
  {
    // https://www.mapillary.com/developer/api-documentation/#coverage-tiles
    id: 'mapillary_coverage',
    tiles: `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${apiKeyMapillary}`,
    minzoom: 0,
    maxzoom: 14,
    attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  },
  // UNUSED ATM:
  // {
  //   // https://www.mapillary.com/developer/api-documentation/#point-tiles
  //   id: 'mapillary_mapfeatures',
  //   tiles: `https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}?access_token=${apiKeyMapillary}`,
  //   minzoom: 14,
  //   maxzoom: 14,
  //   attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  // },
  // UNUSED ATM:
  // {
  //   // https://www.mapillary.com/developer/api-documentation/#traffic-sign-tiles
  //   id: 'mapillary_trafficSigns',
  //   tiles: `https://tiles.mapillary.com/maps/vtp/mly_map_feature_traffic_sign/2/{z}/{x}/{y}?access_token=${apiKeyMapillary}`,
  //   minzoom: 14,
  //   maxzoom: 14,
  //   attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  // },
]
