import { getTilesUrl } from 'src/app/_components/utils/getTilesUrl'
import { MapCategorySource } from '../types'
import { categoryParkingSources, SourcesParkingIds } from './categoryParkingSources.const'

// TODO type MapDataConfigSourcesIds = typeof sources[number]['id']
export type SourcesIds =
  | SourcesParkingIds
  | 'accidents_unfallatlas'
  | 'atlas_barriers'
  | 'atlas_bicycleParking'
  | 'atlas_bikelanes'
  | 'atlas_bikelanesPresence'
  | 'atlas_boundaries'
  | 'atlas_buildings'
  | 'atlas_landuse'
  | 'atlas_lit'
  | 'atlas_maxspeed'
  | 'atlas_places'
  | 'atlas_poiClassification'
  | 'atlas_publicTransport'
  | 'atlas_roadClassification'
  | 'atlas_roads'
  | 'atlas_surfaceQuality'
  | 'atlas_trafficSigns'
  | 'mapillary_coverage'
  | 'mapillary_mapfeatures'
  | 'mapillary_trafficSigns'

export type SourceVerificationApiIdentifier = 'bikelanes'

// Based on `export_geojson_function_from_type` in `tarmac-geo`
export type SourceExportApiIdentifier =
  | 'bikelanes_verified'
  | 'bikelanes'
  | 'bikelanesPresence'
  // | 'boundaries' // Does not work, yet, see 'tarmac-geo'
  | 'buildings'
  | 'landuse'
  | 'lit'
  | 'maxspeed'
  | 'places'
  | 'poiClassification'
  | 'publicTransport'
  | 'roadClassification'
  | 'roads'
  | 'surfaceQuality'
  | 'trafficSigns'

// https://account.mapbox.com/access-tokens
// "Default public token"
const apiKeyMapbox =
  'pk.eyJ1IjoiaGVqY28iLCJhIjoiY2piZjd2bzk2MnVsMjJybGxwOWhkbWxpNCJ9.L1UNUPutVJHWjSmqoN4h7Q'

// https://www.mapillary.com/dashboard/developers
// "Tarmac OSM Viewer", they call it "Client Token"
const apiKeyMapillary = 'MLY|5337311709720950|61508fdcc416406fd8dfb79748463852'

const tilesUrl = getTilesUrl()

export const categorySources: MapCategorySource<
  SourcesIds,
  SourceVerificationApiIdentifier,
  SourceExportApiIdentifier
>[] = [
  ...categoryParkingSources,
  {
    id: 'atlas_boundaries',
    tiles: `${tilesUrl}/public.boundaries/{z}/{x}/{y}.pbf`,
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
    // https://tiles.radverkehrsatlas.de/public.roadClassification.json
    id: 'atlas_roadClassification',
    tiles: `${tilesUrl}/public.roadClassification/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['category', 'name', 'composit_surface_smoothness', 'oneway'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'roadClassification',
      title: 'Straßenklassifizierung',
      desc: '(Wird bald entfernt zu Gunsten eines gemeinsamen Datensatzes.)',
    },
  },
  {
    id: 'atlas_bikelanes',
    tiles: `${tilesUrl}/public.bikelanes_verified/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'composit_highway',
        'category',
        'oneway',
        'traffic_sign',
        'width',
        'composit_surface_smoothness',
        'surface:color__if_present',
        'name',
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
    id: 'atlas_roads',
    tiles: `${tilesUrl}/public.roads/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'osm_name',
        'road',
        'road_oneway',
        'road_oneway:bicycle__if_present',
        'composit_surface_smoothness',
        'composit_lit',
        'composit_maxspeed',
        'composit_road_bikelanes',
        'traffic_sign',
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
    id: 'atlas_bikelanesPresence',
    tiles: `${tilesUrl}/public.bikelanesPresence/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['name', 'highway', 'self', 'left', 'right', 'oneway__if_present'],
    },
    // presence: { enabled: false }, // this is false until we are able to merge the `bikelanesPresence` with `bikelanes`
    verification: { enabled: false },
    freshness: { enabled: true },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.publicTransport.json
    id: 'atlas_publicTransport',
    tiles: `${tilesUrl}/public.publicTransport/{z}/{x}/{y}.pbf`,
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
    // https://tiles.radverkehrsatlas.de/public.poiClassification.json
    id: 'atlas_poiClassification',
    tiles: `${tilesUrl}/public.poiClassification/{z}/{x}/{y}.pbf`,
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
    // https://tiles.radverkehrsatlas.de/public.lit.json
    id: 'atlas_lit',
    tiles: `${tilesUrl}/public.lit/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
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
    // presence: { enabled: true },
    verification: { enabled: false },
    freshness: {
      enabled: true,
      freshConfigs: [
        {
          primaryKeyTranslation: 'Beleuchtung',
          freshKey: 'fresh',
          dateKey: 'check_date:lit',
        },
      ],
    },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'lit',
      title: 'Beleuchtung',
      desc: '(Wird bald entfernt zu Gunsten eines gemeinsamen Datensatzes.)',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.places.json
    id: 'atlas_places',
    tiles: `${tilesUrl}/public.places/{z}/{x}/{y}.pbf`,
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
    // https://tiles.radverkehrsatlas.de/public.maxspeed.json
    id: 'atlas_maxspeed',
    tiles: `${tilesUrl}/public.maxspeed/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'name',
        'highway',
        'maxspeed',
        'maxspeed_source',
        'maxspeed:backward__if_present',
        'maxspeed:forward__if_present',
        'maxspeed:conditional__if_present',
        'traffic_sign__if_present',
      ],
    },
    // presence: { enabled: true },
    verification: { enabled: false },
    freshness: {
      enabled: true,
      freshConfigs: [
        {
          primaryKeyTranslation: 'Höchstgeschwindigkeit',
          freshKey: 'fresh',
          dateKey: 'check_date:maxspeed',
        },
      ],
    },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'maxspeed',
      title: 'Höchstgeschwindigkeit',
      desc: '(Wird bald entfernt zu Gunsten eines gemeinsamen Datensatzes.)',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.surfaceQuality.json
    id: 'atlas_surfaceQuality',
    tiles: `${tilesUrl}/public.surfaceQuality/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: [
        'name',
        'highway',
        'composit_surface_smoothness',
        'surface_source__if_present',
        'smoothness_source__if_present',
      ],
    },
    // presence: { enabled: true },
    verification: { enabled: false },
    freshness: {
      enabled: true,
      freshConfigs: [
        {
          primaryKeyTranslation: 'Belag',
          freshKey: 'fresh_surface',
          dateKey: 'check_date:surface',
        },
        {
          primaryKeyTranslation: 'Zustand',
          freshKey: 'fresh_smoothness',
          dateKey: 'check_date:smoothness',
        },
      ],
    },
    calculator: { enabled: false },
    export: {
      enabled: true,
      apiIdentifier: 'surfaceQuality',
      title: 'Oberflächenqualität',
      desc: '(Wird bald entfernt zu Gunsten eines gemeinsamen Datensatzes.)',
    },
  },
  {
    // https://tiles.radverkehrsatlas.de/public.barrierAreas.json
    // https://tiles.radverkehrsatlas.de/public.barrierLines.json
    id: 'atlas_barriers',
    tiles: `${tilesUrl}/public.barrierAreas,public.barrierLines/{z}/{x}/{y}.pbf`,
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
    // https://tiles.radverkehrsatlas.de/public.buildings.json
    id: 'atlas_buildings',
    tiles: `${tilesUrl}/public.buildings/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: { enabled: false }, // Buidlings have no tags, so nothing to "Inspect"
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false }, // Disabled, since exports only works for datasets with tags
  },
  {
    // https://tiles.radverkehrsatlas.de/public.landuse.json
    id: 'atlas_landuse',
    tiles: `${tilesUrl}/public.landuse/{z}/{x}/{y}.pbf`,
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
    // https://tiles.radverkehrsatlas.de/public.bicycleParking-points.json
    // https://tiles.radverkehrsatlas.de/public.bicycleParking-areas.json
    id: 'atlas_bicycleParking',
    tiles: `${tilesUrl}/public.bicycleParking-points,public.bicycleParking-areas/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>; Prozessierung <a href="https://www.radverkehrsatlas.de">Radverkehrsatlas</a>',
    licence: 'ODbL',
    inspector: {
      enabled: true,
      highlightingKey: 'osm_id',
      documentedKeys: ['capacity', 'capacity:cargo_bike__if_present'],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false }, // TODO
    export: { enabled: false }, // TODO
  },
  {
    // https://tiles.radverkehrsatlas.de/public.trafficSigns.json
    id: 'atlas_trafficSigns',
    tiles: `${tilesUrl}/public.trafficSigns/{z}/{x}/{y}.pbf`,
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
