import { SourcesId } from '../../../_mapData/mapDataSources/sources.const'
import { LegendId, StyleId, SubcategoryId } from '../../../_mapData/typeId'
import { MapDataCategoryId } from '../../../_mapData/mapDataCategories/categories.const'

type SubcatStyleKey = `${SubcategoryId}-${StyleId}`
export const createSubcatStyleKey = (subcatId: SubcategoryId, styleId: StyleId): SubcatStyleKey =>
  `${subcatId}-${styleId}`

type SubcatStyleLegendKey = `${SubcatStyleKey}-${LegendId}`
export const createSubcatStyleLegendKey = (
  subCat: SubcategoryId,
  styleId: StyleId,
  legendId: LegendId,
): SubcatStyleLegendKey => `${subCat}-${styleId}-${legendId}`

export const createSourceSubcatStyleLayerKey = (
  sourceId: string,
  subCat: string,
  styleId: string,
  layerId: string,
) => {
  return `${sourceId}--${subCat}--${styleId}--${layerId}`
}

export const createSourceKeyAtlasGeo = (
  categoryId: MapDataCategoryId,
  sourceId: SourcesId,
  subCat: SubcategoryId,
): string => {
  return `cat:${categoryId}--source:${sourceId}--subcat:${subCat}`
}

export function parseSourceKeyAtlasGeo(source: string): {
  categoryId: MapDataCategoryId
  sourceId: SourcesId
  subCat: SubcategoryId
} {
  // source: "cat:mapillary--source:mapillary_coverage--subcat:mapillaryCoverage"
  // returns: { categoryId: 'mapillary', sourceId: 'mapillary_coverage', subcategoryId: 'mapillaryCoverage' }
  return Object.fromEntries(
    source
      .split('--')
      .map((s) => s.split(':'))
      .map(([k, v]) => [
        {
          cat: 'categoryId',
          source: 'sourceId',
          subcat: 'subcategoryId',
        }[k!],
        v,
      ]),
  )
}
