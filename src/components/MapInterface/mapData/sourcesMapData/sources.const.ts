import { getTilesUrl } from '@components/utils/getTilesUrl'
import { MapDataSource } from '../types'

// TODO type MapDataConfigSourcesIds = typeof sources[number]['id']
export type SourcesIds =
  | 'accidents_unfallatlas'
  | 'mapillary_coverage'
  | 'mapillary_mapfeatures'
  | 'mapillary_trafficSigns'
  | 'osmscripts_highways'
  | 'osmscripts_pois'
  | 'parkraumParking'
  | 'parkraumParkingAreas'
  | 'parkraumParkingDebug'
  | 'parkraumParkingPoints'
  | 'tarmac_bikelanes'
  | 'tarmac_bikelanesPresence'
  | 'tarmac_boundaries'
  | 'tarmac_buildings'
  | 'tarmac_education'
  | 'tarmac_landuse'
  | 'tarmac_lit'
  | 'tarmac_maxspeed'
  | 'tarmac_places'
  | 'tarmac_poiClassification'
  | 'tarmac_publicTransport'
  | 'tarmac_roadClassification'

export type SourceVerificationApiIdentifier =
  | 'lit'
  | 'bikelanes'
  | 'roadclassification'

export type SourceExportApiIdentifier =
  | 'bikelanes_verified'
  | 'education'
  | 'lit_verified'
  | 'places'
  | 'publicTransport'
  | 'roadClassification'
  | 'shops'

// https://account.mapbox.com/access-tokens
// "Default public token"
const apiKeyMapbox =
  'pk.eyJ1IjoiaGVqY28iLCJhIjoiY2piZjd2bzk2MnVsMjJybGxwOWhkbWxpNCJ9.L1UNUPutVJHWjSmqoN4h7Q'

// https://www.mapillary.com/dashboard/developers
// "Tarmac OSM Viewer", they call it "Client Token"
const apiKeyMapillary = 'MLY|5337311709720950|61508fdcc416406fd8dfb79748463852'

const tilesUrl = getTilesUrl()

export const sources: MapDataSource<
  SourcesIds,
  SourceVerificationApiIdentifier,
  SourceExportApiIdentifier
>[] = [
  {
    id: 'parkraumParking',
    tiles:
      'https://vts.mapwebbing.eu/processing.parking_segments/{z}/{x}/{y}.pbf',
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'id',
      documentedKeys: [
        'highway_name',
        'highway',
        'parking',
        'orientation',
        'capacity',
        'source_capacity',
        'length',
        'highway_width_proc_effective',
        'surface',
      ],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },

  {
    id: 'parkraumParkingDebug',
    tiles:
      'https://vts.mapwebbing.eu/processing.buffer_amenity_parking_points,processing.buffer_driveways,processing.buffer_highways,processing.buffer_kerb_intersections,processing.buffer_pedestrian_crossings,processing.buffer_pt_bus,processing.buffer_pt_tram,processing.buffer_ramps/{z}/{x}/{y}.pbf',
    attributionHtml: 'todo', // TODO
    inspector: { enabled: false }, // Those layers have no properties anyways
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'parkraumParkingPoints',
    tiles:
      'https://vts.mapwebbing.eu/processing.parking_spaces/{z}/{x}/{y}.pbf',
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: false,
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: {
      enabled: true,
      keys: ['capacity'],
      queryLayers: [
        'parkraumParkingPoints--parkingPoints--default--parkraumParkingPointsLayer',
      ],
      highlightingKey: 'id',
    },
    export: { enabled: false },
  },
  {
    id: 'parkraumParkingAreas',
    tiles: 'https://vts.mapwebbing.eu/processing.parking_poly/{z}/{x}/{y}.pbf',
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'area_id',
      documentedKeys: [
        'parking',
        'access',
        'capacity__if_present',
        'building__if_present',
      ],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'tarmac_boundaries',
    tiles: `${tilesUrl}/public.boundaries/{z}/{x}/{y}.pbf`,
    attributionHtml:
      'Grenzen: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'accidents_unfallatlas',
    // TODO Migrieren auf Maptiler
    tiles: `https://api.mapbox.com/v4/hejco.5oexnrgf/{z}/{x}/{y}.vector.pbf?sku=101bSz70Afq22&access_token=${apiKeyMapbox}`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'unfall_id',
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // Temporary, nur für den Datenabgleich
    // https://studio.mapbox.com/tilesets/hejco.d7mywzd3/
    id: 'osmscripts_highways',
    tiles: `https://api.mapbox.com/v4/hejco.d7mywzd3/{z}/{x}/{y}.vector.pbf?access_token=${apiKeyMapbox}`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: '@id',
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // Temporary, nur für den Datenabgleich
    // https://studio.mapbox.com/tilesets/hejco.3hccfujx/
    id: 'osmscripts_pois',
    tiles: `https://api.mapbox.com/v4/hejco.3hccfujx/{z}/{x}/{y}.vector.pbf?access_token=${apiKeyMapbox}`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'id',
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.roadClassification.json
    id: 'tarmac_roadClassification',
    tiles: `${tilesUrl}/public.roadClassification/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'roadClassification',
    },
  },
  {
    id: 'tarmac_bikelanes',
    tiles: `${tilesUrl}/public.bikelanes_verified/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'category',
        'cycleway__if_present',
        'oneway__if_present',
        'traffic_sign__if_present',
        'width__if_present',
        'composit_surface_smoothness',
        'surface:color__if_present',
        'name',
        'highway__if_present',
        '_parent_highway__if_present',
      ],
    },
    presence: { enabled: true },
    verification: {
      enabled: true,
      apiIdentifier: 'bikelanes',
    },
    freshness: { enabled: true },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'bikelanes_verified',
    },
  },
  {
    id: 'tarmac_bikelanesPresence',
    tiles: `${tilesUrl}/public.bikelanesPresence/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'name',
        'highway',
        'self',
        'left',
        'right',
        'oneway__if_present',
      ],
    },
    presence: { enabled: false }, // this is false until we are able to merge the `bikelanesPresence` with `bikelanes`
    verification: { enabled: false },
    freshness: { enabled: true },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.publicTransport.json
    id: 'tarmac_publicTransport',
    tiles: `${tilesUrl}/public.publicTransport/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'publicTransport',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.education.json
    id: 'tarmac_education',
    tiles: `${tilesUrl}/public.education/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['amenity', 'name'],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'education',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.poiClassification.json
    id: 'tarmac_poiClassification',
    tiles: `${tilesUrl}/public.poiClassification/{z}/{x}/{y}.pbf`,
    attributionHtml:
      'POIs: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>; Eigene Klassifizierung',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['category', 'type', 'name'],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'shops',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.lit.json
    // https://tiles.radverkehrsatlas.de/public.lit_verified.json
    id: 'tarmac_lit',
    tiles: `${tilesUrl}/public.lit_verified/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      // Keys with underscore are treated special in <TagsTable />
      documentedKeys: [
        'category',
        'lit__if_present',
        'highway',
        'name',
        'composit_surface_smoothness',
      ],
    },
    presence: { enabled: true },
    verification: {
      enabled: true,
      apiIdentifier: 'lit',
    },
    freshness: {
      enabled: true,
      dateKey: 'check_date:lit',
    },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'lit_verified',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.places.json
    id: 'tarmac_places',
    tiles: `${tilesUrl}/public.places/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['name', 'place', 'population', 'population:date'],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'places',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.maxspeed.json
    id: 'tarmac_maxspeed',
    tiles: `${tilesUrl}/public.maxspeed/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'name',
        'highway',
        'maxspeed',
        '_maxspeed_source',
        'traffic_sign__if_present',
        'maxspeed:backward__if_present',
        'maxspeed:forward__if_present',
        'maxspeed:conditional__if_present',
      ],
    },
    presence: {
      enabled: true,
    },
    verification: { enabled: false },
    freshness: {
      enabled: true,
      dateKey: 'fresh',
    },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'places',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.buildings.json
    id: 'tarmac_buildings',
    tiles: `${tilesUrl}/public.buildings/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['building', 'place', 'population', 'population:date'],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.landuse.json
    id: 'tarmac_landuse',
    tiles: `${tilesUrl}/public.landuse/{z}/{x}/{y}.pbf`,
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['landuse'],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // https://www.mapillary.com/developer/api-documentation/#coverage-tiles
    id: 'mapillary_coverage',
    tiles: `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${apiKeyMapillary}`,
    minzoom: 0,
    maxzoom: 14,
    attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
    inspector: {
      enabled: true,
      highlightingKey: 'id', // OR: 'image_id' for points, 'sequence_id' for lines
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  // UNUSED ATM:
  // {
  //   // https://www.mapillary.com/developer/api-documentation/#point-tiles
  //   id: 'mapillary_mapfeatures',
  //   tiles: `https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}?access_token=${apiKeyMapillary}`,
  //   minzoom: 14,
  //   maxzoom: 14,
  //   attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  //   highlightingKey: 'id',
  // },
  // UNUSED ATM:
  // {
  //   // https://www.mapillary.com/developer/api-documentation/#traffic-sign-tiles
  //   id: 'mapillary_trafficSigns',
  //   tiles: `https://tiles.mapillary.com/maps/vtp/mly_map_feature_traffic_sign/2/{z}/{x}/{y}?access_token=${apiKeyMapillary}`,
  //   minzoom: 14,
  //   maxzoom: 14,
  //   attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
  //   highlightingKey: 'id',
  // },
]
