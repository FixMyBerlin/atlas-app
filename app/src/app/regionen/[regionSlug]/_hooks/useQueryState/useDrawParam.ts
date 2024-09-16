import { createParser, useQueryState } from 'nuqs'
import { DrawArea } from '../../_components/Map/Calculator/CalculatorControlsDrawControl'
import { searchParamsRegistry } from './searchParamsRegistry'
import { jsurlParse, jurlStringify } from './useCategoriesConfig/v1/jurlParseStringify'
import { createMemoizer } from './utils/createMemoizer'

const memoizer = createMemoizer()

const drawParamParser = createParser({
  parse: (query: string) => jsurlParse(query) as DrawArea[],
  serialize: (value: DrawArea[]) => jurlStringify(value),
}).withOptions({ history: 'replace' })

export const useDrawParam = () => {
  const [drawParam, setDrawParam] = useQueryState(searchParamsRegistry.draw, drawParamParser)
  return memoizer({ drawParam, setDrawParam })
}
