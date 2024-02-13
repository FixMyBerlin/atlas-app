import invariant from 'tiny-invariant'
import { MapDataCategoryId, categories } from '../mapDataCategories/categories.const'
import { SourcesId, sources } from '../mapDataSources/sources.const'
import { SourcesDatasetsIds } from '../mapDataSources/sourcesDatasets/sourcesDatasets.const'

export const getCategoryData = (categoryId: MapDataCategoryId | undefined) => {
  const categoryData = categories.find((the) => the.id === categoryId)
  invariant(categoryData, `getCategoryData: category data for ${categoryId} missing`)
  return categoryData
}

export const getSourceData = (sourceId: SourcesId) => {
  const sourceData = sources?.find((s) => s.id === sourceId)
  invariant(sourceData, `getSourceData: sourceData for ${sourceId} missing`)
  return sourceData
}

export const getDatasetOrSourceData = (
  sourceId: SourcesDatasetsIds | SourcesId,
  sourcesDatasets: Record<string, any>[],
) => {
  const sourceData = sources?.find((s) => s.id === sourceId)
  const datasetData = sourcesDatasets.find((s) => s.id === sourceId)
  return sourceData || datasetData
}
