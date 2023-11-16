import { createParser, useQueryState } from 'next-usequerystate'
import { customParse, customStringify } from './useConfigParamParser/customParseStringify'
import { CategoryConfig } from '../../_components/mapStateConfig/type'

export const useConfigParam = () => {
  const configParamParser = createParser({
    parse: (query: string) => customParse(query) as CategoryConfig[],
    serialize: (value: CategoryConfig[]) => customStringify(value),
  }).withOptions({ history: 'push' })

  const [configParam, setConfigParam] = useQueryState('config', configParamParser)

  // We assume that at this point the config is present, because we initialize the page with one
  return { configParam: configParam!, setConfigParam }
}
