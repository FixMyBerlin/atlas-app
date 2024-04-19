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

function createKey(obj: Record<string, string>) {
  return Object.entries(obj)
    .map(([shortKey, value]) => `${shortKey}:${value}`)
    .join('--')
}

const delimiter = '--'
function parseKey(key: string, shortToLong: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    key
      .split(delimiter)
      .map((s) => s.split(':'))
      .map(([shortKey, value]) => [shortToLong[shortKey!], value]),
  )
}

export const createLayerKeyAtlasGeo = (
  sourceId: SourcesId,
  subCat: SubcategoryId,
  styleId: string,
  layerId: string,
) =>
  createKey({
    source: sourceId,
    subcat: subCat,
    style: styleId,
    layer: layerId,
  })

export const createSourceKeyAtlasGeo = (
  categoryId: MapDataCategoryId,
  sourceId: SourcesId,
  subCat: SubcategoryId,
): string =>
  createKey({
    cat: categoryId,
    source: sourceId,
    subcat: subCat,
  })

export function parseSourceKeyAtlasGeo(sourceKey: string) {
  // source: "cat:mapillary--source:mapillary_coverage--subcat:mapillaryCoverage"
  // returns: { categoryId: 'mapillary', sourceId: 'mapillary_coverage', subcategoryId: 'mapillaryCoverage' }
  return parseKey(sourceKey, {
    cat: 'categoryId',
    source: 'sourceId',
    subcat: 'subcategoryId',
  }) as {
    categoryId: MapDataCategoryId
    sourceId: SourcesId
    subcategoryId: SubcategoryId
  }
}

export function isSourceKeyAtlasGeo(key: string) {
  // TODO: make this stricter
  return key.search(delimiter) !== -1
}
