import { TableId } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSources/tables.const'

export type GeneralizedTableId = `atlas_generalized_${Lowercase<TableId>}`
export const generalizationFunctionIdentifier = (tableName: TableId) =>
  `atlas_generalized_${tableName.toLowerCase()}` as GeneralizedTableId
