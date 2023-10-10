'use client'

import invariant from 'tiny-invariant'
import { datasets } from '../../datasets/datasets.const'
import { DatasetIds } from '../../datasets/types'

export const sourceDatasetIdUrl = (datasetId: DatasetIds) => {
  invariant(datasets[datasetId], 'Dataset missing')
  return { id: datasetId, url: `pmtiles://${datasets[datasetId]}` }
}
