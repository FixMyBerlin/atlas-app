import { mergeCategoriesConfig } from './mergeCategoriesConfig'
import { MapDataCategoryConfig } from '../type'
import { isJsurlString, jsurlParse } from './jurlParseStringify'
import { expandObjectKeys } from './minimzeObjectKeys'

/** @desc A specific parser that also migrates any URL into the newest schema */
export const configCustomParse = (value: string | null, freshConfig: MapDataCategoryConfig[]) => {
  if (!value) return mergeCategoriesConfig({ freshConfig, urlConfig: undefined })

  const object = isJsurlString(value)
    ? expandObjectKeys(jsurlParse(value) as Record<string, any>)
    : []

  const merged = mergeCategoriesConfig({
    freshConfig,
    urlConfig: object as MapDataCategoryConfig[],
  })

  return merged
}
