// Define the export tables

export const exportApiIdentifier = [
  'bicycleParking_points',
  'bicycleParking_areas', // private for now
  'bikelanes',
  'bikeroutes',
  // ,'boundaries' // Does not work, yet, see 'tarmac-geo'
  'landuse',
  'places',
  'poiClassification',
  'publicTransport',
  'roads',
  'roadsPathClasses',
  'bikelanesPresence', // based on `roads`
  'trafficSigns',
  'barrierAreas',
  'barrierLines',
  'boundaries',
  'boundaryLabels',
] as const

export type SourceExportApiIdentifier = (typeof exportApiIdentifier)[number]

export const exportFunctionIdentifier = <TId extends SourceExportApiIdentifier>(tableName: TId) =>
  `atlas_export_geojson_${tableName.toLowerCase()}` as `atlas_export_geojson_${Lowercase<TId>}`
