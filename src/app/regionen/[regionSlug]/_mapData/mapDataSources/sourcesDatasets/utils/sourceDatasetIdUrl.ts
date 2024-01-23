import invariant from 'tiny-invariant'
import { datasets } from '../../datasets/datasets.const'
import { DatasetIds } from '../../datasets/types'

export const sourceDatasetIdUrl = (datasetId: DatasetIds) => {
  invariant(datasets[datasetId], 'Dataset missing')
  let url = datasets[datasetId] as string
  if (url.startsWith('private/')) {
    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN
    const slug = url.split('/')[1]
    url = `${origin}/api/pmtiles/${slug}`
  }
  return { id: datasetId, url: `pmtiles://${url}` }
}
