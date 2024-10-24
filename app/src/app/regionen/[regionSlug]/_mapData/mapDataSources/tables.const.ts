// This is a list of all the tables we generate in atlas-geo. We might auto generate this list in the future.
export type TableId =
  | 'barrierLines'
  | 'barrierAreas'
  | 'bicycleParking_points'
  | 'bicycleParking_areas'
  | 'bikeroutes'
  | 'boundaries'
  | 'boundaryLabels'
  | 'landuse'
  | 'places'
  | 'poiClassification'
  | 'publicTransport'
  | 'roads'
  | 'roadsPathClasses'
  | 'bikelanesPresence' // based on `roads`
  | 'bikeSuitability' // based on `roads`
  | 'bikelanes'
  | 'trafficSigns'

export type UnionTiles<T extends string> = T | `${T},${T}`
