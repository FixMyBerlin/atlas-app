import { MapDataCategoryConfig, MapDataCategoryParam } from '../type'
import { jurlStringify } from './jurlParseStringify'
import { minimizeObjectKeys } from './minimzeObjectKeys'

export const simplifyConfigForParams = (categoriesConfig: MapDataCategoryConfig[]) => {
  return categoriesConfig.map((categoryConfig) => {
    return {
      id: categoryConfig.id,
      active: categoryConfig.active,
      subcategories: categoryConfig.subcategories.map((subcategoryConfig) => {
        return {
          id: subcategoryConfig.id,
          // TODO: Optimierung: An dieser Stelle nur dann eintragen, wenn Auswahl anders als Default-Style ist. Damit sparen wir Platz in der URL.
          styles: subcategoryConfig.styles.map((styleConfig) => {
            return { id: styleConfig.id, active: styleConfig.active }
          }),
        }
      }),
    }
  }) satisfies MapDataCategoryParam[]
}

export const configCustomStringify = (categoriesConfig: MapDataCategoryConfig[]) => {
  const simplified = simplifyConfigForParams(categoriesConfig)
  const minimized = minimizeObjectKeys(simplified)

  return jurlStringify(minimized)
}
