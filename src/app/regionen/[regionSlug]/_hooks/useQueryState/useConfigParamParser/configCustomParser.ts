import { initializeMapRegionConfig } from '../../../_components/mapStateConfig/initializeMapRegionConfig'
import { CategoryConfig } from '../../../_components/mapStateConfig/type'
import { isJsurlString, jsurlParse, jurlStringify } from './jurlParseStringify'
import { expandObjectKeys, minimizeObjectKeys } from './minimzeObjectKeys'

/** @desc A specific parser that also migrates any URL into the newest schema */
export const configCustomParse = (value: string, freshConfig: CategoryConfig[]): unknown => {
  const object = isJsurlString(value)
    ? expandObjectKeys(jsurlParse(value) as Record<string, any>)
    : []

  const migrated = initializeMapRegionConfig({
    freshConfig,
    urlConfig: object as CategoryConfig[],
  })

  return migrated
}

export const configCustomStringify = (value: Record<string, any>) => {
  return jurlStringify(minimizeObjectKeys(value))
}
