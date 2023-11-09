import { createParser, useQueryState } from 'next-usequerystate'
import { customParse, customStringify } from './useConfigParamParser/customParseStringify'

export const useConfigParam = () => {
  const configParamParser = createParser({
    parse: (query: string) => customParse(query),
    serialize: (value) => customStringify(value),
  }).withOptions({ history: 'push' })

  const [configParam, setConfigParam] = useQueryState('config', configParamParser)

  return { configParam, setConfigParam }
}
