import invariant from 'tiny-invariant'
import { DatasetIds, datasets } from '../../datasets'

export const sourceDatasetIdUrl = (datasetId: DatasetIds) => {
  invariant(datasets[datasetId], 'Dataset missing')
  return { id: datasetId, url: `pmtiles://${datasets[datasetId]}` }
}
