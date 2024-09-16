import { MapDataCategoryConfig } from '../type'
import { mergeCategoriesConfig } from '../utils/mergeCategoriesConfig'
import { expandObjectKeys } from './expandObjectKeys'
import { isJsurlString, jsurlParse } from './jurlParseStringify'

/** @desc A specific parser that also migrates any URL into the newest schema */
export const configCustomParse = (value: string | null, freshConfig: MapDataCategoryConfig[]) => {
  if (!value) return mergeCategoriesConfig({ freshConfig, urlConfig: undefined })

  const object = isJsurlString(value)
    ? expandObjectKeys(jsurlParse(value) as Record<string, any>)
    : []

  // jsurlParse will return `{reset=true}` when the parsing fails.
  // In this case, we want to fall back to the fresh config.
  if ('reset' in object && object.reset === true) {
    return mergeCategoriesConfig({ freshConfig, urlConfig: undefined })
  }

  const merged = mergeCategoriesConfig({
    freshConfig,
    urlConfig: object as MapDataCategoryConfig[],
  })

  return merged
}
