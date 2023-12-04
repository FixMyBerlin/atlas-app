import { MapDataCategoryIds } from '../../_mapData/mapDataCategories/categories.const'
import { getCategoryData, getSubcategoryData } from '../../_mapData/utils/getMapDataUtils'
import { CategoryConfig } from './type'

/**
 * @desc Our main state object per category. It holds the `active`-values. Which are either the `defaultActive`s given by the configs (from files) or the current `active` values specified by the url config (User). Wording Convention: We use this `*Config` (eg `categoryConfig) to reference this config and `*Data` (eg `categoryData`) to reference the mapData object and holds static details like name, description and such.~~
 */
export const createMapRegionConfig = (regionCategoryIds: MapDataCategoryIds[]) => {
  // We want to preserve the sort order of `regionCategoryIds`.
  const sortedCategoryData = regionCategoryIds.map((id) => getCategoryData(id))

  return sortedCategoryData.map((categoryData) => {
    return {
      id: categoryData.id,
      active: categoryData.id === 'bikelanes' ?? false, // TODO: We probably want to extract this into the config, so we can specify the default active category per region.
      subcategories: categoryData.subcategories.map((subcategoryDataConfig) => {
        // What we get here as `subcategoryDataConfig` is the `id`+`defaultStyle`
        // object from src/app/regionen/[regionSlug]/_mapData/mapDataCategories/categories.const.ts
        // Therefore, we need to look up the full data:
        const subcategoryData = getSubcategoryData(subcategoryDataConfig.id)
        return {
          id: subcategoryData.id,
          styles: subcategoryData.styles.map((style) => {
            return {
              id: style.id,
              active: style.id === subcategoryDataConfig.defaultStyle,
            }
          }),
        }
      }),
    }
  }) as CategoryConfig[]
}
