import invariant from 'tiny-invariant'
import { SourcesId } from '../../../_mapData/mapDataSources/sources.const'
import { LegendId, StyleId, SubcategoryId } from '../../../_mapData/typeId'

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

export const createSourceKeyAtlasGeo = (categoryId: string, sourceId: string, subCat: string) => {
  return `cat:${categoryId}--source:${sourceId}--subcat:${subCat}`
}

export const extractSourceIdIdFromAtlasGeoSourceKey = (
  sourceKey: ReturnType<typeof createSourceKeyAtlasGeo>,
) => {
  const regex = /--source:(\w+)/
  const match = sourceKey.match(regex)
  invariant(
    match,
    `Did not find source in extractSourceIdIdFromSourceKey for sourceKey:${sourceKey}`,
  )
  return match[1] as SourcesId
}

export const extractSubcatIdFromAtlasGeoSourceKey = (
  sourceKey: ReturnType<typeof createSourceKeyAtlasGeo>,
) => {
  const regex = /--subcat:(\w+)/
  const match = sourceKey.match(regex)
  invariant(
    match,
    `Did not find subcategory in extractSubcatIdFromSourceKey for sourceKey:${sourceKey}`,
  )
  return match[1] as SubcategoryId
}
