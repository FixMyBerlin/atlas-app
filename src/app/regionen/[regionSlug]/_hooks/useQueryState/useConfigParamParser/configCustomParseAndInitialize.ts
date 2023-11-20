import { initializeMapRegionConfig } from '../../../_components/mapStateConfig/initializeMapRegionConfig'
import { ThemeConfig } from '../../../_components/mapStateConfig/type'
import { configCustomParseV3, isV3String } from './configCustomParserV3'
import { isJsurlString, jsurlParse, jurlStringify } from './jurlParseStringify'
import { expandObjectKeys, minimizeObjectKeys } from './minimzeObjectKeys'

/** @desc A specific parser that also migrates any URL into the newest schema */
export const configCustomParseAndInitialize = (
  value: string,
  freshConfig: ThemeConfig[],
): unknown => {
  const object = isV3String(value)
    ? configCustomParseV3(value)
    : isJsurlString(value)
      ? expandObjectKeys(jsurlParse(value) as Record<string, any>)
      : []

  const migrated = initializeMapRegionConfig({
    freshConfig,
    urlConfig: object as ThemeConfig[],
  })

  return migrated
}
