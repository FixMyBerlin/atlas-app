import { getTilesUrl } from 'src/app/_components/utils/getTilesUrl'
import { MapDataSource } from '../types'
import { sourcesParking, SourcesParkingId } from './sourcesParking.const'

// TODO type MapDataConfigSourcesIds = typeof sources[number]['id']
export type SourcesId =
  | SourcesParkingId
  | 'accidents_unfallatlas'
  | 'atlas_barriers'
  | 'atlas_bicycleParking'
  | 'atlas_bikelanes'
  | 'atlas_bikeroutes'
  | 'atlas_boundaries'
  | 'atlas_boundaryStats'
  | 'atlas_landuse'
  | 'atlas_places'
  | 'atlas_poiClassification'
  | 'atlas_publicTransport'
  | 'atlas_roads'
  | 'atlas_trafficSigns'
  | 'mapillary_coverage'
  | 'mapillary_mapfeatures'
  | 'mapillary_trafficSigns'

// Define the verification tables
export const verificationApiIdentifier = ['bikelanes'] as const
export type SourceVerificationApiIdentifier = (typeof verificationApiIdentifier)[number]
export const verifiedTableIdentifier = <TId extends SourceVerificationApiIdentifier>(
  tableName: TId,
) => `${tableName.toLowerCase()}_verified` as `${Lowercase<TId>}_verified`
export const verificationTableIdentifier: Record<SourceVerificationApiIdentifier, string> = {
  bikelanes: 'BikelaneVerification',
}

// Define the export tables
export const exportApiIdentifier = [
  'bicycleParking_points',
  'bicycleParking_areas', // private for now
  verifiedTableIdentifier('bikelanes'),
  'bikeroutes',
  // ,'boundaries' // Does not work, yet, see 'tarmac-geo'
  'landuse',
  'places',
  'poiClassification',
  'publicTransport',
  'roads',
  'trafficSigns',
  'barrierAreas',
  'barrierLines',
  'boundaries',
  'boundaryLabels',
] as const

export type SourceExportApiIdentifier = (typeof exportApiIdentifier)[number]
export const exportFunctionIdentifier = <TId extends SourceExportApiIdentifier>(tableName: TId) =>
  `atlas_export_geojson_${tableName.toLowerCase()}` as `atlas_export_geojson_${Lowercase<TId>}`

// https://account.mapbox.com/access-tokens
// "Default public token"
const apiKeyMapbox =
  'pk.eyJ1IjoiaGVqY28iLCJhIjoiY2piZjd2bzk2MnVsMjJybGxwOWhkbWxpNCJ9.L1UNUPutVJHWjSmqoN4h7Q'

// https://www.mapillary.com/dashboard/developers
// "Tarmac OSM Viewer", they call it "Client Token"
const apiKeyMapillary = 'MLY|5337311709720950|61508fdcc416406fd8dfb79748463852'

const tilesUrl = getTilesUrl()

export const sources: MapDataSource<
  SourcesId,
  SourceVerificationApiIdentifier,
  SourceExportApiIdentifier
>[] = [
  ...sourcesParking,
  {
    id: 'atlas_boundaries',
    tiles: `${tilesUrl}/boundaries,boundaryLabels/{z}/{x}/{y}`,
    attributionHtml: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'area_id',
      documentedKeys: ['name', 'admin_level'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'atlas_boundaryStats',
    tiles: `${tilesUrl}/boundaryStats/{z}/{x}/{y}`,
    attributionHtml: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['name', 'admin_level'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'accidents_unfallatlas',
    // TODO Migrieren auf Maptiler
    tiles: `https://api.mapbox.com/v4/hejco.5oexnrgf/{z}/{x}/{y}.vector.pbf?sku=101bSz70Afq22&access_token=${apiKeyMapbox}`,
    attributionHtml: 'Unfallatlas', // TODO
    licence: undefined, // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'unfall_id',
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'atlas_bikelanes',
    tiles: `${tilesUrl}/bikelanes_verified/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'name',
        'composit_highway',
        'category',
        'oneway',
        'osm_traffic_sign',
        'osm_traffic_sign:forward__if_present',
        'osm_traffic_sign:backward__if_present',
        'width',
        'composit_surface_smoothness',
        'osm_surface:color__if_present',
        'composit_mapillary',
        'description__if_present',
      ],
    },
    // presence: { enabled: true },
    verification: {
      enabled: true,
      apiIdentifier: 'bikelanes',
    },
    freshness: { enabled: true },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'bikelanes_verified',
      title: 'Fahrradinfrastruktur',
      desc: 'Prozessierte Infrastrukturdaten (ohne Mischverkehr)',
    },
  },
  {
    id: 'atlas_bikeroutes',
    tiles: `${tilesUrl}/bikeroutes`, // TileJSON
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['name'],
    },
    // presence: { enabled: false }, // this is false until we are able to merge the `bikelanesPresence` with `bikelanes`
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'atlas_roads',
    tiles: `${tilesUrl}/roads/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'name',
        'road',
        'road_oneway',
        'road_oneway:bicycle__if_present',
        'composit_surface_smoothness',
        'composit_lit',
        'composit_maxspeed',
        'composit_road_bikelanes',
        'osm_traffic_sign',
        'osm_traffic_sign:forward__if_present',
        'osm_traffic_sign:backward__if_present',
        'composit_mapillary',
        'description__if_present',
      ],
    },
    // presence: { enabled: false }, // this is false until we are able to merge the `bikelanesPresence` with `bikelanes`
    verification: { enabled: false },
    freshness: { enabled: true },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'roads',
      title: 'Straßennetz',
      desc: 'Straßentyp, Beleuchtung, Oberfläche, Höchstgeschwindigkeit',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/publicTransport
    id: 'atlas_publicTransport',
    tiles: `${tilesUrl}/publicTransport/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['name'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'publicTransport',
      title: 'ÖPNV',
      desc: 'Punktdaten von Haltestellen',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/poiClassification
    id: 'atlas_poiClassification',
    tiles: `${tilesUrl}/poiClassification/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['name', 'category', 'type'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'poiClassification',
      title: 'POI Einkauf, Freizeit, Bildung',
      desc: 'Kategorisiert Punktdaten. Bildungsdaten können über `formalEducation` gefiltert werden.',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/places
    id: 'atlas_places',
    tiles: `${tilesUrl}/places/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['name', 'place', 'population', 'population:date'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'places',
      title: 'Orte',
      desc: 'Punktdaten zu Städten und Dörfern',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/barrierAreas
    // https://tiles.radverkehrsatlas.de/barrierLines
    id: 'atlas_barriers',
    tiles: `${tilesUrl}/barrierAreas,barrierLines/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: { enabled: false },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // https://tiles.radverkehrsatlas.de/landuse
    id: 'atlas_landuse',
    tiles: `${tilesUrl}/landuse/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['landuse'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // https://tiles.radverkehrsatlas.de/bicycleParking_points
    // https://tiles.radverkehrsatlas.de/bicycleParking_areas
    id: 'atlas_bicycleParking',
    tiles: `${tilesUrl}/bicycleParking_points,bicycleParking_areas/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'capacity',
        'capacity:cargo_bike__if_present',
        'composit_mapillary',
        'description__if_present',
      ],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false }, // TODO
    export: {
      enabled: true,
      apiIdentifier: 'bicycleParking_points',
      title: 'Fahrradstellplätze',
      desc: 'Alle Fahrradstellplätze. Flächen werden als Punkt ausgegeben.',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/trafficSigns
    id: 'atlas_trafficSigns',
    tiles: `${tilesUrl}/trafficSigns/{z}/{x}/{y}`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['traffic_sign'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false }, // TODO
    export: {
      enabled: true,
      apiIdentifier: 'trafficSigns',
      title: 'Verkehrszeichen',
      desc: 'Verkehrszeichen und Routen-Beschilderungen',
    },
  },
  {
    // https://www.mapillary.com/developer/api-documentation/#coverage-tiles
    id: 'mapillary_coverage',
    tiles: `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${apiKeyMapillary}`,
    minzoom: 0,
    maxzoom: 14,
    attributionHtml: 'Daten von Mapillary', // TODO – could not find anything specific; they don't attribute on their own page.
    licence: undefined, // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'id', // OR: 'image_id' for points, 'sequence_id' for lines
      editors: [
        {
          name: 'Mapillary Image',
          idKey: 'id',
          urlTemplate: 'https://www.mapillary.com/app/?focus=photo&pKey={osm_id}',
        },
        {
          name: 'Mapillary Panorama',
          idKey: 'id',
          urlTemplate: 'https://www.mapillary.com/app/?panos=true&pKey={osm_id}',
        },
        {
          name: 'Kartaview',
          urlTemplate: 'https://kartaview.org/map/@{latitude},{longitude},{zoom}z',
        },
      ],
    },
    // presence: { enabled: false },
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
