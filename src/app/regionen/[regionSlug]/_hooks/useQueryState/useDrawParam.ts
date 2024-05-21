import { createParser, useQueryState } from 'nuqs'
import { DrawArea } from '../../_components/Map/Calculator/CalculatorControlsDrawControl'
import { jsurlParse, jurlStringify } from './useCategoriesConfig/parser/jurlParseStringify'
import { searchParamsRegistry } from './searchParamsRegistry'

export const useDrawParam = () => {
  const drawParamParser = createParser({
    parse: (query: string) => jsurlParse(query) as DrawArea[],
    serialize: (value: DrawArea[]) => jurlStringify(value),
  }).withOptions({ history: 'replace' })

  const [drawParam, setDrawParam] = useQueryState(searchParamsRegistry.draw, drawParamParser)

  return { drawParam, setDrawParam }
}
