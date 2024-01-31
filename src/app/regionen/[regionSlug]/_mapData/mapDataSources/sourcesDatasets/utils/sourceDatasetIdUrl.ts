import { datasets } from '../../datasets/datasets.const'
import { DatasetIds } from '../../datasets/types'

export const sourceLegacyDatasetIdUrl = (datasetId: DatasetIds) => {
  const url = datasets[datasetId]
  return { id: datasetId, url: `pmtiles://${url}` }
}

export const sourceStaticDatasetIdUrl = (staticDatasetSlug: string) => {
  const url = `${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/uploads/${staticDatasetSlug}`
  return { id: staticDatasetSlug, url: `pmtiles://${url}` }
}
