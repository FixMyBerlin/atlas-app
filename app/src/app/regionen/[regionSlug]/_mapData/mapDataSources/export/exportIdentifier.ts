// Define the export tables

export const exportApiIdentifier = [
  'bicycleParking_points',
  'bicycleParking_areas', // private for now
  'bikelanes',
  'bikeroutes',
  // 'boundaries', // Does not work, yet, see 'tarmac-geo'
  'landuse',
  'places',
  'poiClassification',
  'publicTransport',
  'roads',
  'roadsPathClasses',
  'bikelanesPresence', // based on `roads`
  'bikeSuitability', // based on `roads`
  'trafficSigns',
  'barrierAreas',
  'barrierLines',
  'boundaries',
  'boundaryLabels',
  // 'aggregated_lengths', // Does not work because the table does not conform to the required table structure with `tags` and `meta`
  'todos_lines',
] as const

export type SourceExportApiIdentifier = (typeof exportApiIdentifier)[number]

export const exportFunctionIdentifier = <TId extends SourceExportApiIdentifier>(tableName: TId) =>
  `atlas_export_flatgeobuf_${tableName.toLowerCase()}` as `atlas_export_flatgeobuf_${Lowercase<TId>}`
