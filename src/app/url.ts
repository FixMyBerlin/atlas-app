import { SourcesId } from './regionen/[regionSlug]/_mapData/mapDataSources/sources.const'

export const numericSourceIds: Record<number, SourcesId> = {
  // 1 - 10 for special sources like mappilary
  1: 'mapillary_coverage',
  // 20 - 40 for external osm sources
  21: 'parkraumParking',
  22: 'parkraumParkingDebug',
  23: 'parkraumParkingPoints',
  24: 'parkraumParkingAreas',
  25: 'parkraumParkingStats',
  // 40+ for internal osm sources
  40: 'atlas_boundaries',
  41: 'atlas_boundaryStats',
  42: 'accidents_unfallatlas',
  43: 'atlas_bikelanes',
  44: 'atlas_bikeroutes',
  45: 'atlas_roads',
  46: 'atlas_roadsPathClasses',
  47: 'atlas_publicTransport',
  48: 'atlas_poiClassification',
  49: 'atlas_places',
  50: 'atlas_barriers',
  51: 'atlas_landuse',
  52: 'atlas_bicycleParking',
  53: 'atlas_trafficSigns',
}
