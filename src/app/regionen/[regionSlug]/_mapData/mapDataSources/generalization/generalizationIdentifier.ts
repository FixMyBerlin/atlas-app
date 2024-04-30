// This type includes all tables we generate in atlas-geo
// TODO: automatically generate this in atlas-geo
export type TableId =
  | 'barrierLines'
  | 'barrierAreas'
  | 'bicycleParking_points'
  | 'bicycleParking_areas'
  | 'bikeroutes'
  | 'boundaries'
  | 'boundaryLabels'
  | 'presenceStats'
  | 'landuse'
  | 'places'
  | 'poiClassification'
  | 'publicTransport'
  | 'roads'
  | 'roadsPathClasses'
  | 'bikelanes'
  | 'trafficSigns'

export const generalizationFunctionIdentifier = (tableName: TableId) =>
  `atlas_generalized_${tableName.toLowerCase()}` as `atlas_generalized_${Lowercase<TableId>}`
