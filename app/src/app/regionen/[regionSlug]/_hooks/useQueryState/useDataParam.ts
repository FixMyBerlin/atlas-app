import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { createMemoizer } from './utils/createMemoizer'

const memoizer = createMemoizer()

export const useDataParam = () => {
  const [dataParam, setDataParam] = useQueryState(
    searchParamsRegistry.data,
    parseAsArrayOf(parseAsString).withDefault([]),
  )

  return memoizer({ dataParam, setDataParam })
}
