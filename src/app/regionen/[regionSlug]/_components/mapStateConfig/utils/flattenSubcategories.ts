import { CategoryConfig, SubcategoryConfig } from '../type'

export const flattenSubcategories = (categoryConfigs: CategoryConfig[]) => {
  const subcategoryConfigConfigs: SubcategoryConfig[] = []

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
