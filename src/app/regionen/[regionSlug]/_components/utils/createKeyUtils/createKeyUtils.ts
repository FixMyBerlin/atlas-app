import {
  SubcategoryIds,
  SubcategoryStyleIds,
  SubcatStyleLegendIds,
} from '../../mapData/mapData.const'
import { StoreFeaturesInspector } from '../../mapStateInteraction/useMapStateInteraction'
import { SubcatStyleKey, SubcatStyleLegendKey } from './types'

export const createSubcatStyleKey = (
  subcatId: SubcategoryIds,
  styleId: SubcategoryStyleIds,
): SubcatStyleKey => `${subcatId}-${styleId}`

export const createSubcatStyleLegendKey = (
  subCat: SubcategoryIds,
  styleId: SubcategoryStyleIds,
  legendId: SubcatStyleLegendIds,
): SubcatStyleLegendKey => `${subCat}-${styleId}-${legendId}`

export const createSourceSubcatStyleLayerKey = (
  sourceId: string,
  subCat: string,
  styleId: string,
  layerId: string,
) => {
  return `${sourceId}--${subCat}--${styleId}--${layerId}`
}

export const createSourceKey = (categoryId: string, sourceId: string, subCat: string) => {
  return `cat:${categoryId}--source:${sourceId}--subcat:${subCat}`
}

export const createDatasetSourceLayerKey = (sourceId: string, layerId: string) => {
  return `${sourceId}--${layerId}`
}

export const createInspectorFeatureKey = (
  feature: StoreFeaturesInspector['unfilteredInspectorFeatures'][number],
) => {
  // TODO, this has a static set of IDs which are defined on `sourceData.inspector.highlightingKey`
  // Ideally we would pick the value form sourceData, but that does not work for sourceDatasets
  return `${feature.source}-${
    feature?.properties?.id || feature?.properties?.area_id || feature?.properties?.osm_id
  }`
}
