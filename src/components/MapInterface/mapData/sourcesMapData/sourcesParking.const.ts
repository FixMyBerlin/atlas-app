import { MapDataSource } from '../types'
import { SourceExportApiIdentifier, SourceVerificationApiIdentifier } from './sources.const'

export type SourcesParkingIds =
  | 'parkraumParking'
  | 'parkraumParkingAreas'
  | 'parkraumParkingDebug'
  | 'parkraumParkingPoints'
  | 'parkraumParkingStats'

export const sourcesParking: MapDataSource<
  SourcesParkingIds,
  SourceVerificationApiIdentifier,
  SourceExportApiIdentifier
>[] = [
  {
    id: 'parkraumParking',
    tiles:
      'https://vts.mapwebbing.eu/processing.parking_segments,processing.parking_segments_label/{z}/{x}/{y}.pbf',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: true,
      highlightingKey: 'id',
      documentedKeys: [
        'highway_name',
        'highway',
        'parking',
        'capacity_status',
        'orientation',
        'position',
        'capacity',
        'source_capacity__if_present', // unfortunatelly it is always present so we "hide" it for some cases with a "-" translation
        'length',
        'highway_width_proc_effective',
        'surface',
        'operator_type',
      ],
      editors: [
        {
          name: 'Parklinien Editor',
          urlTemplate: 'https://tordans.github.io/parking-lanes/#{zoom}/{latitude}/{longitude}',
        },
      ],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'parkraumParkingDebug',
    tiles: `https://vts.mapwebbing.eu/${[
      'processing.buffer_amenity_parking_points',
      'processing.buffer_amenity_parking_poly',
      // 'processing.buffer_area_highway', // this is just to cut out fragments, nothing to show
      'processing.buffer_driveways',
      'processing.buffer_highways',
      'processing.buffer_kerb_intersections',
      'processing.buffer_obstacle_poly',
      'processing.buffer_pedestrian_crossings',
      'processing.buffer_pt_bus',
      'processing.buffer_pt_tram',
      'processing.buffer_ramps',
    ].join(',')}/{z}/{x}/{y}.pbf`,
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: { enabled: false }, // Those layers have no properties anyways
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'parkraumParkingPoints',
    tiles: 'https://vts.mapwebbing.eu/processing.parking_spaces/{z}/{x}/{y}.pbf',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: false,
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: {
      enabled: true,
      keys: ['capacity'],
      queryLayers: ['parkraumParkingPoints--parkingPoints--default--circle'],
      highlightingKey: 'id',
    },
    export: { enabled: false },
  },
  {
    id: 'parkraumParkingAreas',
    tiles: 'https://vts.mapwebbing.eu/processing.parking_poly/{z}/{x}/{y}.pbf',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: true,
      highlightingKey: 'id',
      documentedKeys: [
        'parking',
        'access',
        'operator_type',
        'capacity__if_present',
        'building__if_present',
        'fee__if_present',
        'markings__if_present',
        'orientation__if_present',
        'surface__if_present',
        'description__if_present',
      ],
      editors: [
        {
          name: 'Parkplätze Editor',
          urlTemplate:
            'https://mapcomplete.osm.be/parkings.html?z={zoom}&lat={latitude}&lon={longitude}&language=de#{osm_type}/{osm_id}',
        },
      ],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
  {
    id: 'parkraumParkingStats',
    tiles: 'https://vts.mapwebbing.eu/processing.boundaries_stats/{z}/{x}/{y}.pbf',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: true,
      highlightingKey: 'id',
      documentedKeys: [
        'name',
        'd_other_km',
        'on_kerb_km',
        'half_on_kerb_km',
        'done_percent',
        'admin_level',
        'aera_sqkm',
        'lane_km',
        'street_side_km',
        'sum_km',
        'length_wo_dual_carriageway',
      ],
    },
    // presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
]
