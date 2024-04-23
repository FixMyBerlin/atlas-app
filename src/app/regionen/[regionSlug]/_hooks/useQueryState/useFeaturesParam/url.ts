import { SourcesId } from '../../../_mapData/mapDataSources/sources.const'

// initially generated with:
// const numericSourceIds= {...{1: 'osm-notes'}, ...Object.fromEntries(sources.map((s, i) => [i+2, s.id]))}
export const numericSourceIds: Record<number, SourcesId> = {
  // @ts-expect-error because it's not included in source
  1: 'osm-notes',
  2: 'parkraumParking',
  3: 'parkraumParkingDebug',
  4: 'parkraumParkingPoints',
  5: 'parkraumParkingAreas',
  6: 'parkraumParkingStats',
  7: 'atlas_boundaries',
  8: 'atlas_boundaryStats',
  9: 'accidents_unfallatlas',
  10: 'atlas_bikelanes',
  11: 'atlas_bikeroutes',
  12: 'atlas_roads',
  13: 'atlas_roadsPathClasses',
  14: 'atlas_publicTransport',
  15: 'atlas_poiClassification',
  16: 'atlas_places',
  17: 'atlas_barriers',
  18: 'atlas_landuse',
  19: 'atlas_bicycleParking',
  20: 'atlas_trafficSigns',
  21: 'mapillary_coverage',
}
