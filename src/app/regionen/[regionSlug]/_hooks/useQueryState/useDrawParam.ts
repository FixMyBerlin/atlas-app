import { createParser, useQueryState } from 'next-usequerystate'
import { DrawArea } from '../../_components/Map/Calculator/CalculatorControlsDrawControl'
import { jsurlParse, jurlStringify } from './useConfigParamParser/jurlParseStringify'

export const useDrawParam = () => {
  const drawParamParser = createParser({
    parse: (query: string) => {
      return jsurlParse(query) as DrawArea[]
    },
    serialize: (value: DrawArea[]) => {
      return jurlStringify(value)
    },
  }).withOptions({ history: 'replace' })

  const [drawParam, setDrawParam] = useQueryState('draw', drawParamParser)

  return { drawParam, setDrawParam }
}
