import invariant from 'tiny-invariant'
import { mapData, SubcategoryIds, SubcategoryStyleIds } from '../mapData.const'
import { SourcesIds } from '../mapDataSources/sources.const'
import {
  sourcesDatasets,
  SourcesDatasetsIds,
} from '../mapDataSources/sourcesDatasets/sourcesDatasets.const'
import { MapDataCategoryIds, categories } from '../mapDataCategories/categories.const'
import { MapDataStyle, MapDataSubcat } from '../types'

export const getCategoryData = (categoryId: MapDataCategoryIds | undefined) => {
  const categoryData = categories.find((the) => the.id === categoryId)
  invariant(categoryData, `getCategoryData: category data for ${categoryId} missing`)
  return categoryData
}

export const getSubcategoryData = (subcatId: SubcategoryIds | undefined) => {
  const subcatData = mapData?.subcategories.find((t) => t.id === subcatId)
  invariant(subcatData, `getSubcategoryData: subcategory data for ${subcatId} missing`)
  return subcatData
}

export const getStyleData = (
  subcatData: MapDataSubcat | undefined,
  styleId: SubcategoryStyleIds | undefined,
) => {
  const styleData = subcatData?.styles.find((s) => s.id === styleId)
  invariant(styleData, `getStyleData: styleData for ${styleId} missing`)
  return styleData
}

export const getSourceData = (sourceId: SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  invariant(sourceData, `getSourceData: sourceData for ${sourceId} missing`)
  return sourceData
}

export const getDatasetOrSourceData = (sourceId: SourcesDatasetsIds | SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  const datasetData = sourcesDatasets?.find((s) => s.id === sourceId)
  return sourceData || datasetData
}
