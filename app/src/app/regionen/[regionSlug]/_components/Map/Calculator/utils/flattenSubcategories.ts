import {
  MapDataCategoryConfig,
  MapDataSubcategoryConfig,
} from '../../../../_hooks/useQueryState/useCategoriesConfig/type'

export const flattenSubcategories = (categoryConfigs: MapDataCategoryConfig[]) => {
  const subcategoryConfigConfigs: MapDataSubcategoryConfig[] = []

  categoryConfigs.forEach((categoryConfig) =>
    categoryConfig.subcategories.map((subcategoryConfigConfig) => {
      // What we get here as `subcategoryConfigConfig` is the `id`+`active`
      // object from src/app/regionen/[regionSlug]/_components/mapStateConfig/type.ts

      if (!subcategoryConfigConfigs.some((t) => t.id === subcategoryConfigConfig.id)) {
        subcategoryConfigConfigs.push(subcategoryConfigConfig)
      }
    }),
  )
  return subcategoryConfigConfigs
}
