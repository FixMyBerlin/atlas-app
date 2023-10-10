'use client'

import { createParser, useQueryState } from 'next-usequerystate'
import { customParse, customStringify } from './useConfigParamParser/customParseStringify'

export const useDrawParam = () => {
  const drawParamParser = createParser({
    parse: (query: string) => customParse(query),
    serialize: (value) => customStringify(value),
  }).withOptions({ history: 'replace' })

  const [drawParam, setDrawParam] = useQueryState('draw', drawParamParser)

  // TODO: Fix 'any' types on those.
  return { drawParam, setDrawParam }
}
