import { createParser, useQueryState } from 'next-usequerystate'
import {
  customParse,
  customStringify,
} from 'src/app/regionen/_components/useQueryState/useConfigParamParser/customParseStringify'

export const useConfigParam = () => {
  const configParamParser = createParser({
    parse: (query: string) => customParse(query),
    serialize: (value) => customStringify(value),
  }).withOptions({ history: 'push' })

  const [configParam, setConfigParam] = useQueryState('config', configParamParser)

  // TODO: Fix 'any' types on those.
  return { configParam, setConfigParam }
}
