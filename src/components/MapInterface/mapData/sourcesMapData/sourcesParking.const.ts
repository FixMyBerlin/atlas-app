import { MapDataSource } from '../types'
import {
  SourceExportApiIdentifier,
  SourceVerificationApiIdentifier,
} from './sources.const'

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
    id: 'parkraumParkingStats',
    tiles:
      'https://vts.mapwebbing.eu/processing.boundaries_stats/{z}/{x}/{y}.pbf',
    attributionHtml: 'todo', // TODO
    inspector: {
      enabled: true,
      highlightingKey: 'id',
      documentedKeys: [
        'name',
        'd_other_km',
        'done_percent',
        'admin_level',
        'aera_sqkm',
        'lane_km',
        'street_side_km',
        'sum_km',
        'length_wo_dual_carriageway',
      ],
    },
    presence: { enabled: false },
    verification: { enabled: false },
    freshness: { enabled: false },
    calculator: { enabled: false },
    export: { enabled: false },
  },
]
