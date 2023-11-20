import { initializeMapRegionConfig } from '../../../_components/mapStateConfig/initializeMapRegionConfig'
import { ThemeConfig } from '../../../_components/mapStateConfig/type'
import { isJsurlString, jsurlParse, jurlStringify } from './jurlParseStringify'
import { legacyParse } from './legacyParse'
import { expandObjectKeys, minimizeObjectKeys } from './minimzeObjectKeys'

export const customParse = (value: string): unknown => {
  if (isJsurlString(value)) {
    return expandObjectKeys(jsurlParse(value) as Record<string, any>)
  }

  return legacyParse(value)
}

/** @desc A specific parser that also migrates any URL into the newest schema */
export const customParseConfig = (value: string, freshConfig: ThemeConfig[]): unknown => {
  const object = customParse(value)

  if (!Array.isArray(object)) return object

  const migrated = initializeMapRegionConfig({
    freshConfig,
    urlConfig: object as ThemeConfig[],
  })

  return migrated
}

export const customStringify = (value: Record<string, any>) => {
  return jurlStringify(minimizeObjectKeys(value))
}
