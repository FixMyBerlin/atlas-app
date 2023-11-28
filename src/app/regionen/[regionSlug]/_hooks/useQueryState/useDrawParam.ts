import { createParser, useQueryState } from 'next-usequerystate'
import { DrawArea } from '../../_components/Map/Calculator/CalculatorControlsDrawControl'
import { customParse, customStringify } from './useConfigParamParser/customParseStringify'

export const useDrawParam = () => {
  const drawParamParser = createParser({
    parse: (query: string) => customParse(query) as DrawArea[],
    serialize: (value: DrawArea[]) => customStringify(value),
  }).withOptions({ history: 'replace' })

  const [drawParam, setDrawParam] = useQueryState('draw', drawParamParser)

  return { drawParam, setDrawParam }
}
