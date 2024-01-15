import { MapDataDatasetsSource } from '../../types'
import { DatasetIds } from '../datasets/types'
import { sourcesDatasetsBrandenburg } from './sourcesDatasetsBrandenburg.const'
import { sourcesDatasetsBerlin } from './sourcesDatasetsBerlin.const'
import { sourcesDatasetsBiBi } from './sourcesDatasetsBibi.const'
import { sourcesDatasetsTrTo } from './sourcesDatasetsTrTo.const'
import { sourcesDatasetsWoldegk } from './sourcesDatasetsWoldegk.const'

export type SourcesDatasetsIds = DatasetIds
export type SourceDatasets = MapDataDatasetsSource<SourcesDatasetsIds>[]

export const sourcesDatasets: SourceDatasets = [
  ...sourcesDatasetsBiBi,
  ...sourcesDatasetsTrTo,
  ...sourcesDatasetsBerlin,
  ...sourcesDatasetsWoldegk,
  ...sourcesDatasetsBrandenburg,
]
